import { NodemailerOptions } from '../interfaces';
import { BaseProvider, BaseProviderSendOptions } from '../interfaces/provider';
import { Package } from '@libs/intent/utils';

export class NodemailerProvider implements BaseProvider {
  private client: any;

  constructor(private options: NodemailerOptions) {
    const nodemailer = Package.load('nodemailer');
    console.log(options);
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
    console.log('sending from nodemailer');
    return this.client.sendMail(payload);
  }

  getClient<T>(): T {
    return this.client;
  }
}
