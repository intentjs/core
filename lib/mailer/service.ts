import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/service';
import { logTime } from '../utils';
import { InternalLogger } from '../utils/logger';
import { MailData, MailerOptions } from './interfaces';
import { BaseProvider, BaseProviderSendOptions } from './interfaces/provider';
import { MAIL_PROVIDER_MAP } from './providers';

@Injectable()
export class MailerService {
  private static options: MailerOptions;
  private static channels: Record<string, BaseProvider>;

  constructor(private config: ConfigService) {
    const options = this.config.get('mailers') as MailerOptions;

    MailerService.options = options;
    MailerService.channels = {};
    for (const channel in options.channels) {
      const time = Date.now();
      const cOptions = options.channels[channel];
      const driver = MAIL_PROVIDER_MAP[cOptions.provider];
      if (!driver) {
        InternalLogger.error(
          'MailerService',
          `We couldn't find any channel driver associated with the [${channel}].`,
        );
        continue;
      }

      MailerService.channels[channel] = new driver(
        cOptions as unknown as never,
      );
      InternalLogger.success(
        'MailerService',
        `Channel [${channel}] successfully initiailized ${logTime(
          Date.now() - time,
        )}`,
      );
    }
  }

  static getConfig(): MailerOptions {
    return MailerService.options;
  }

  static async send(options: BaseProviderSendOptions, providerName: string) {
    const config = MailerService.options;
    providerName = providerName ?? config.default;
    const providerConfig = config.channels[providerName];
    const mailData = (await options.mail.getMailData()) as MailData;
    const mail = {
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      from: options.sender || providerConfig['from'],
      html: mailData.html,
      subject: mailData.subject,
      attachments: mailData.attachments,
    } as BaseProviderSendOptions;

    if (options.replyTo || providerConfig['replyTo']) {
      mail.replyTo = options.replyTo || providerConfig['replyTo'];
    }

    if (options.inReplyTo) {
      mail.inReplyTo = options.inReplyTo;
    }

    const provider = MailerService.channels[providerName];
    await provider.send(mail);
  }
}
