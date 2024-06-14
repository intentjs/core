import { Injectable } from '@nestjs/common';
import { Command } from '../decorators';
import { CommandMeta } from '../metadata';
import * as pc from 'picocolors';
import { ConsoleIO } from '../consoleIO';

@Injectable()
@Command('list', { desc: 'Command to list all the commands' })
export class ListCommands {
  public async handle(_cli: ConsoleIO): Promise<void> {
    const commands = CommandMeta.getAllCommands();
    const keys = Object.keys(commands).sort().reverse();

    const commandGroups: { [key: string]: string[] } = { '#': [] };
    for (const key of keys) {
      const c = key.split(':');

      if (c.length === 1) {
        if (commandGroups[c[0]]) {
          commandGroups[c[0]].push(key);
        } else {
          commandGroups['#'].push(c[0]);
        }
      } else {
        if (commandGroups[c[0]]) {
          commandGroups[c[0]].push(key);
        } else {
          commandGroups[c[0]] = [key];
        }
      }
    }

    for (const group in commandGroups) {
      _cli.success(pc.bgBlue(pc.white(pc.bold(' ' + group + ' '))));
      const list = [];
      const sortedCommands = commandGroups[group].sort();
      for (const command of sortedCommands) {
        const options = commands[command].meta || {};
        list.push({
          command: pc.green(pc.bold(command)),
          description: options.desc || 'No Description Passed',
        });
      }

      _cli.table(['Command', 'Description'], list);
    }
  }
}
