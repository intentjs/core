import { SendgridApiOptions } from '../interfaces';
import { BaseProvider, BaseProviderSendOptions } from '../interfaces/provider';

export class SendgridProvider implements BaseProvider {
  constructor(private options: SendgridApiOptions) {}

  send(payload: BaseProviderSendOptions): Promise<void> {
    console.log(payload);
    throw new Error('Method not implemented.');
  }

  getClient<T>(): T {
    throw new Error('Method not implemented.');
  }
}
