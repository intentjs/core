import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServiceProviderContainer } from './serviceProviderContainer';
import { Kernel } from '../rest/foundation/kernel';
import { Type } from '../interfaces';
import { IntentGuard } from '../rest/foundation/guards/baseGuard';
import { APP_GUARD } from '@nestjs/core';
import { MiddlewareConfigurator } from '../rest/foundation/middlewares/configurator';

export class ModuleBuilder {
  static build(container: ServiceProviderContainer, kernel: Kernel) {
    const providers = container.scanProviders();
    const controllers = container.scanControllers();
    /**
     * Scan for global middlewares
     */
    const globalMiddlewares = kernel.middlewares();
    const globalGuards = ModuleBuilder.buildGlobalGuardProviders(
      kernel.guards(),
    );

    const middlewareConfigurator = new MiddlewareConfigurator();
    kernel.middlewareGroups(middlewareConfigurator);

    @Module({
      imports: container.scanImports(),
      providers: [...providers, ...globalGuards],
      controllers: controllers,
    })
    class AppModule implements NestModule {
      configure(consumer: MiddlewareConsumer) {
        /**
         * Apply global middleware for all routes if any found.
         */
        if (globalMiddlewares.length) {
          consumer.apply(...globalMiddlewares).forRoutes('');
        }

        /**
         * Apply route specific middlewares
         */
        if (middlewareConfigurator.hasAnyRule()) {
          for (const rule of middlewareConfigurator.getAllRules()) {
            console.log(rule);
            consumer
              .apply(rule.middleware)
              .exclude(...rule.excludedFor)
              .forRoutes(...rule.appliedFor);
          }
        }
      }
    }

    return AppModule;
  }

  static buildGlobalGuardProviders(guards: Type<IntentGuard>[]) {
    const providers = [];
    for (const guard of guards) {
      providers.push({
        provide: APP_GUARD,
        useClass: guard,
      });
    }

    return providers;
  }
}
