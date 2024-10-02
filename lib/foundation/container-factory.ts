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

    /**
     * Build a module for NestJS DI Container
     */
    const module = ModuleBuilder.build(container);

    /**
     * Build NestJS DI Container
     */
    const app = await NestFactory.createApplicationContext(module);

    /**
     * Run the `boot` method of the main application container
     */
    container.boot(app);

    return app;
  }
}
