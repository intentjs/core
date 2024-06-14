import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '../console';
import { CodegenService } from './service';

@Injectable()
export class CodegenCommand {
  constructor(private service: CodegenService) {}

  @Command('make:config {namespace}', { desc: 'Command to make config' })
  async makeConfig(_cli: ConsoleIO): Promise<void> {
    const namespace = _cli.argument<string>('namespace');
    const filePath = `config/${namespace}.ts`;

    /**
     * Check if the config already exists
     */
    try {
      await this.service.checkIfFileAlreadyExists(filePath);
    } catch (e) {
      _cli.error(e.message);
      return;
    }

    const stubContent = await this.service.prepareFromStub({
      stubName: 'config',
      state: { namespace },
    });

    // write the stub to the desired location
    await this.service.writeToPath(filePath, stubContent);
    _cli.success(`Successfully created ${filePath}`);
  }

  @Command('make:controller {name}', { desc: 'Command to create a controller' })
  async makeController(_cli: ConsoleIO): Promise<void> {
    _cli.info;
  }
}
