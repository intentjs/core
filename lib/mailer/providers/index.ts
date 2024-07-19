import { NodemailerProvider } from './nodemailer';
import { SendgridProvider } from './sendgrid';

export const MAIL_PROVIDER_MAP = {
  sendgrid: SendgridProvider,
  smtp: NodemailerProvider,
};
