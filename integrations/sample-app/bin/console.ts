import {
  CommandMeta,
  CommandRunner,
  ContainerFactory,
  ConsoleLogger,
} from '@intentjs/core';
import yargs from 'yargs-parser';
import 'console.mute';

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ApplicationContainer } = require('app/boot/container');

  console['mute']();
  await ContainerFactory.createStandalone(ApplicationContainer);
  console['resume']();

  const argv = yargs(process.argv.slice(2));
  argv.command = argv._[0];

  if (typeof argv.command != 'string') {
    ConsoleLogger.error(' PLEASE ADD A COMMAND ');
    return process.exit();
  }

  const command = CommandMeta.getCommand(argv.command);
  if (!command || !command.target) {
    ConsoleLogger.error(` ${argv.command} : command not found `);
    return process.exit();
  }

  await CommandRunner.handle(command, argv);
}

bootstrap();
