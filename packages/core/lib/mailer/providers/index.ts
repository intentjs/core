import { LoggerProvider } from './logger';
import { MailgunProvider } from './mailgun';
import { NodemailerProvider } from './nodemailer';
import { ResendMailProvider } from './resend';
// import { SendgridProvider } from './sendgrid';

export const MAIL_PROVIDER_MAP = {
  smtp: NodemailerProvider,
  mailgun: MailgunProvider,
  resend: ResendMailProvider,
  logger: LoggerProvider,
};
