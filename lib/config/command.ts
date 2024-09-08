import { Injectable } from '@nestjs/common';
import pc from 'picocolors';
import { Command, ConsoleIO } from '../console';
import { Obj } from '../utils';
import { Arr } from '../utils/array';
import { columnify } from '../utils/columnify';
import { IntentConfig } from './service';

@Injectable()
export class ViewConfigCommand {
  constructor(private config: IntentConfig) {}

  @Command('config:view {namespace}', {
    desc: 'Command to view config for a given namespace',
  })
  async handle(_cli: ConsoleIO): Promise<void> {
    const namespace = _cli.argument<string>('namespace');
    const config = this.config.get(namespace);
    if (!config) {
      _cli.error(`config with ${namespace} namespace not found`);
      return;
    }
    const columnifiedConfig = columnify(
      Arr.toObj(Obj.entries(config), ['key', 'value']),
    );
    const printRows = [];
    for (const row of columnifiedConfig) {
      printRows.push([pc.green(row[0]), pc.yellow(row[1])].join(' '));
    }

    // eslint-disable-next-line no-console
    console.log(printRows.join('\n'));
  }
}
