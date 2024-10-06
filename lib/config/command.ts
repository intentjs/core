import { Inject, Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '../console';
import { Obj } from '../utils';
import { Arr } from '../utils/array';
import { columnify } from '../utils/columnify';
import * as pc from 'picocolors';
import { ConfigMap } from './options';
import { CONFIG_FACTORY } from './constant';

@Injectable()
export class ViewConfigCommand {
  constructor(@Inject(CONFIG_FACTORY) private config: ConfigMap) {}

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

    console.log(printRows.join('\n'));
  }
}
