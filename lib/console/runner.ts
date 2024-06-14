import * as pc from 'picocolors';
import { CommandObject } from './interfaces';
import { ConsoleIO } from './consoleIO';
import { Logger } from './logger';
import yargsParser from 'yargs-parser';
import { CommandMeta } from './metadata';

export class CommandRunner {
  static async run(cmd: string): Promise<void> {
    const argv = yargsParser(cmd);
    const command = CommandMeta.getCommand(argv._[0] as string);
    await CommandRunner.handle(command, argv);
  }

  static async handle(
    command: CommandObject | null,
    args: Record<string, any>,
  ): Promise<void> {
    if (command == null) {
      Logger.error('No command found');
      return;
    }

    if (args.options) {
      CommandRunner.printOptions(command);
      return;
    }

    const _cli = ConsoleIO.from(command.expression, args);
    if (_cli.hasErrors && _cli.missingArguments.length > 0) {
      _cli.error(` Missing Arguments: ${_cli.missingArguments.join(', ')} `);
      return;
    }

    await command.target(_cli);
    return;
  }

  static printOptions(command: CommandObject) {
    console.log(pc.bold('Expression: ') + command.expression);
    if (command.meta.desc) {
      console.log(pc.bold('Description: ') + command.meta.desc);
    }
    console.log('\n');

    if (command.arguments.length > 0) {
      Logger.success(pc.bgBlue(pc.white(pc.bold(' Arguments '))));

      const list = [];
      for (const argument of command.arguments) {
        console.log(argument);
        list.push({
          name: argument.name,
          desc: 'No description passed',
          default: argument.defaultValue,
          isArray: argument.isArray ? 'Y' : 'N',
        });
      }

      Logger.table(['Name', 'Description', 'Default', 'Is Array?'], list);
    }

    if (command.options.length > 0) {
      Logger.success(pc.bgBlue(pc.white(pc.bold(' Options '))));

      const list = [];
      for (const option of command.options) {
        list.push({
          name: option.name,
          desc: '',
          default: option.defaultValue || 'null',
          isArray: option.isArray ? 'Y' : 'N',
        });
      }

      Logger.table(['Name', 'Desc', 'Default', 'Is Array?'], list);
    }
  }
}
