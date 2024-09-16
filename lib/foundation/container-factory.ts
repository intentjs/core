import { NestFactory } from '@nestjs/core';
import { IntentApplicationContext, Type } from '../interfaces';
import { ModuleBuilder } from './module-builder';
import { IntentAppContainer } from './app-container';

export class ContainerFactory {
  static async createStandalone(
    containerCls: Type<IntentAppContainer>,
  ): Promise<IntentApplicationContext> {
    const container = new containerCls();
    container.build();
    const module = ModuleBuilder.build(container);
    const app = await NestFactory.createApplicationContext(module);
    container.boot(app);
    return app;
  }
}
