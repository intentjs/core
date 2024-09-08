import { Provider } from '@nestjs/common';
import { IntentApplication, Type } from '../interfaces';
import { ImportType, ServiceProvider } from './serviceProvider';

export abstract class ServiceProviderContainer {
  static serviceProviders: ServiceProvider[] = [];

  add(...serviceProviders: Type<ServiceProvider>[]) {
    for (const sp of serviceProviders) {
      const instance = new sp();
      instance.register();
      ServiceProviderContainer.serviceProviders.push(instance);
    }
  }

  scanImports(): ImportType[] {
    const imports: ImportType[] = [];
    for (const serviceProvider of ServiceProviderContainer.serviceProviders) {
      imports.push(...serviceProvider.getAllImports());
    }
    return imports;
  }

  scanControllers(): Type<any>[] {
    const controllers: Type<any>[] = [];
    for (const serviceProvider of ServiceProviderContainer.serviceProviders) {
      controllers.push(...serviceProvider.getAllControllers());
    }
    return controllers;
  }

  scanProviders(): Provider[] {
    const providers: Provider[] = [];

    for (const serviceProvider of ServiceProviderContainer.serviceProviders) {
      providers.push(...serviceProvider.getAllProviders());
    }

    return providers;
  }

  async boot(app: IntentApplication): Promise<void> {
    for (const serviceProvider of ServiceProviderContainer.serviceProviders) {
      serviceProvider.boot(app);
    }
  }

  abstract handle();
}
