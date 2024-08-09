import { Log } from '../../logger';
import { NodemailerOptions } from '../interfaces';
import { BaseProvider, BaseProviderSendOptions } from '../interfaces/provider';

export class LoggerProvider implements BaseProvider {
  private client: any;

  constructor(private options: NodemailerOptions) {}

  async send(payload: BaseProviderSendOptions): Promise<void> {
    Log().debug(payload);
  }

  getClient<T>(): T {
    return this.client as unknown as T;
  }
}
