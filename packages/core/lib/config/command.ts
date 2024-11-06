import { Command, ConsoleIO } from '../console';
import { ConfigMap } from './options';
import { CONFIG_FACTORY } from './constant';
import pc from 'picocolors';
import archy from 'archy';
import { Inject } from '../foundation';
import { jsonToArchy } from '../utils/console-helpers';

@Command('config:view {--ns : Namespace of a particular config}', {
  desc: 'Command to view config for a given namespace',
})
export class ViewConfigCommand {
  constructor(@Inject(CONFIG_FACTORY) private config: ConfigMap) {}

  async handle(_cli: ConsoleIO): Promise<void> {
    const nsFlag = _cli.option<string>('ns');
    const printNsToConsole = (namespace, obj) => {
      const values = obj.get('static') as Record<string, any>;
      console.log(
        archy(jsonToArchy(values, pc.bgGreen(pc.black(` ${namespace} `)))),
      );
    };

    if (nsFlag) {
      const ns = this.config.get(nsFlag);
      printNsToConsole(nsFlag, ns);
      return;
    }

    // Example usage
    for (const [namespace, obj] of this.config.entries()) {
      printNsToConsole(namespace, obj);
    }
  }
}
