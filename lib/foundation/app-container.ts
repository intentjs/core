import { Provider } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  IntentApplication,
  IntentApplicationContext,
  Type,
} from '../interfaces';
import { ImportType, ServiceProvider } from './service-provider';

export abstract class IntentAppContainer {
  static serviceProviders: ServiceProvider[] = [];

  add(...serviceProviders: Type<ServiceProvider>[]) {
    for (const sp of serviceProviders) {
      const instance = new sp();
      instance.register();
      IntentAppContainer.serviceProviders.push(instance);
    }
  }

  scanImports(): ImportType[] {
    const imports: ImportType[] = [];
    for (const serviceProvider of IntentAppContainer.serviceProviders) {
      imports.push(...serviceProvider.getAllImports());
    }
    return imports;
  }

  scanProviders(): Provider[] {
    const providers: Provider[] = [];

    for (const serviceProvider of IntentAppContainer.serviceProviders) {
      providers.push(...serviceProvider.getAllProviders());
    }

    return providers;
  }

  async boot(app: IntentApplication | IntentApplicationContext): Promise<void> {
    for (const serviceProvider of IntentAppContainer.serviceProviders) {
      serviceProvider.boot(app);
    }
  }

  abstract build();
}
