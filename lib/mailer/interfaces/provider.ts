import { MailMessage } from '../message';

export interface BaseProviderSendOptions {
  sender: string;
  to: string | string[];
  cc: string | string[];
  bcc: string | string[];
  from?: string | Record<string, any>;
  html?: string;
  subject?: string;
  attachments?: Record<string, any>[];
  inReplyTo?: string;
  replyTo?: string | string[];
  mail: MailMessage;
}

export interface BaseProvider {
  send(payload: BaseProviderSendOptions): Promise<void>;
  getClient<T>(): T;
}
