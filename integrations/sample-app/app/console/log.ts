import { Command, ConsoleIO, log } from '@intentjs/core';

@Command('test:log', { desc: 'Command to test the log' })
export class TestLogConsoleCommand {
  async handle(_cli: ConsoleIO) {
    _cli.info('Testing the log');
    log('Hello world!!');
  }
}
