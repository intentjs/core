import { Command, ConsoleIO, log, Mail, MailMessage } from '@intentjs/core';

@Command('test:mail', { desc: 'Command to test the log' })
export class TestMailConsoleCommand {
  async handle(_cli: ConsoleIO) {
    log('Sending out email');
    const mail3 = MailMessage.init()
      .greeting('Hey there')
      .line('We received your request to reset your account password.')
      .button('Click here to reset your password', 'https://google.com')
      .line('Alternative, you can also enter the code below when prompted')
      .inlineCode('ABCD1234')
      .line('Rise & Shine,')
      .line('V')
      .subject('Hey there from Intent');
    await Mail.init().to('vinayak@tryhanalabs.com').send(mail3);
    return true;
  }
}
