import { readFileSync } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import * as pc from 'picocolors';
import { columnify } from '../../utils/columnify';
import { Str } from '../../utils/string';
import { Command } from '../decorators';
import { CommandMeta } from '../metadata';

@Injectable()
@Command('list', { desc: 'Command to list all the commands' })
export class ListCommands {
  public async handle(): Promise<void> {
    const commands = CommandMeta.getAllCommands();

    const list = [];
    const groupsWithIndices = {};
    for (const commandKey in commands) {
      const commandInfo = commands[commandKey];
      const group = Str.before(commandKey, ':');
      groupsWithIndices[group] = [];
      list.push({
        command: commandKey,
        desc: commandInfo.meta.desc || '',
      });
    }

    const formattedRows = columnify(list, { padStart: 2 });
    const groups = {};
    for (const row of formattedRows) {
      const group = Str.before(row[0], ':').trim();
      if (groups[group]) {
        groups[group].push(row);
      } else {
        groups[group] = [row];
      }
    }

    // create rows
    const printRows = [pc.yellow(Str.prepend('Available Commands:', ' '))];
    for (const group in groups) {
      printRows.push(pc.yellow(Str.prepend(group, ' ')));
      for (const command of groups[group]) {
        printRows.push([pc.green(command[0]), command[1]].join(' '));
      }
    }

    /**
     * Read package.json
     */
    const packageJson = JSON.parse(
      readFileSync(join(path, 'package.json')).toString(),
    );
    console.log();
    console.log(
      pc.white(
        ` IntentJS ${packageJson.dependencies['@intentjs/core'] || '0.0.1'}`,
      ),
    );
    console.log();
    console.log(printRows.join('\n'));
    console.log();
    return;
  }
}
