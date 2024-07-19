import { Injectable } from '@nestjs/common';
import { MailData, MailerOptions } from './interfaces';
import { IntentConfig } from '../config/service';
import { BaseProvider, BaseProviderSendOptions } from './interfaces/provider';
import { MAIL_PROVIDER_MAP } from './providers';

@Injectable()
export class MailerService {
  private static options: MailerOptions;
  private static channels: Record<string, BaseProvider>;

  constructor(private config: IntentConfig) {
    const options = this.config.get('mailers') as MailerOptions;

    MailerService.options = options;
    MailerService.channels = {};
    for (const channel in options.channels) {
      const cOptions = options.channels[channel];
      MailerService.channels[channel] = new MAIL_PROVIDER_MAP[
        cOptions.provider
      ](cOptions as unknown as never);
    }

    console.log(MailerService.channels);
  }

  static getConfig(): MailerOptions {
    return MailerService.options;
  }

  static async send(options: BaseProviderSendOptions, providerName: string) {
    const config = MailerService.options;
    providerName = providerName ?? config.default;
    const providerConfig = config.channels[providerName];
    const mailData = options.mail.getMailData() as MailData;
    const mail = {
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      from: options.sender || providerConfig.from,
      html: mailData.html,
      subject: mailData.subject,
      attachments: mailData.attachments,
    } as BaseProviderSendOptions;

    if (options.replyTo || providerConfig.replyTo) {
      mail.replyTo = options.replyTo || providerConfig.replyTo;
    }

    if (options.inReplyTo) {
      mail.inReplyTo = options.inReplyTo;
    }

    console.log(mail);

    const provider = MailerService.channels[providerName];
    await provider.send(mail);
  }
}
