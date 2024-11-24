import { Module } from '@nestjs/common';
import { Kernel } from '../rest';
import { IntentAppContainer } from './app-container';

export class ModuleBuilder {
  static build(container: IntentAppContainer, kernel?: Kernel) {
    const providers = container.scanProviders();

    @Module({
      imports: container.scanImports(),
      providers: [...providers],
    })
    class AppModule {}

    return AppModule;
  }
}
