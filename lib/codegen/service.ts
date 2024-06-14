import { Injectable } from '@nestjs/common';
import { Edge } from 'edgejs-cjs';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class CodegenService {
  private rootDir = join(__dirname, '../../../../../');

  constructor() {}

  async checkIfFileAlreadyExists(filePath: string): Promise<void> {
    const doesFileExists = existsSync(join(this.rootDir, filePath));
    if (doesFileExists) {
      throw new Error(`${filePath} already exists`);
    }
  }

  async prepareFromStub(options: Record<string, any>): Promise<string> {
    const edge = Edge.create({ cache: true });

    edge.mount(new URL(`file://${join(this.rootDir, 'stubs')}`));

    const { stubName, state } = options;
    const content = await edge.render(`${stubName}.edge`, state);
    return content;
  }

  async writeToPath(filePath: string, content: string): Promise<string> {
    const resultantPath = join(this.rootDir, filePath);
    writeFileSync(resultantPath, content);
    return resultantPath;
  }
}
