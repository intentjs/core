import { Package } from '../../utils';
import { NodemailerOptions } from '../interfaces';
import { BaseProvider, BaseProviderSendOptions } from '../interfaces/provider';

export class NodemailerProvider implements BaseProvider {
  private client: any;

  constructor(private options: NodemailerOptions) {
    const nodemailer = Package.load('nodemailer');
    this.client = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.port === '465',
      ignoreTLS: options.ignoreTLS,
      requireTLS: options.requireTLS,
      auth: {
        user: options.username,
        pass: options.password,
      },
    });
  }

  async send(payload: BaseProviderSendOptions): Promise<void> {
    return this.client.sendMail({
      from: payload.from,
      to: payload.to,
      attachments: payload.attachments?.map(a => ({
        filename: a.filename,
        content: a.content,
        path: a.url,
      })),
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo,
      inReplyTo: payload.inReplyTo,
      bcc: payload.bcc,
      cc: payload.bcc,
    });
  }

  getClient<T>(): T {
    return this.client as unknown as T;
  }
}
