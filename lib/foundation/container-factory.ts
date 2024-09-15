import { NestFactory } from '@nestjs/core';
import { IntentApplicationContext, Type } from '../interfaces';
import { ModuleBuilder } from './module-builder';
import { IntentAppContainer } from './app-container';

export class ContainerFactory {
  static createStandalone(
    containerCls: Type<IntentAppContainer>,
  ): Promise<IntentApplicationContext> {
    const container = new containerCls();
    container.build();
    const module = ModuleBuilder.build(container);
    return NestFactory.createApplicationContext(module);
  }
}
