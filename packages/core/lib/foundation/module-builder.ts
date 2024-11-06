import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Type } from '../interfaces';
import { IntentGuard, Kernel } from '../rest';
import { MiddlewareConfigurator } from '../rest/foundation/middlewares/configurator';
import { IntentAppContainer } from './app-container';

export class ModuleBuilder {
  static build(container: IntentAppContainer, kernel?: Kernel) {
    const providers = container.scanProviders();
    const controllers = kernel?.controllers() || [];
    /**
     * Scan for global middlewares
     */
    const globalMiddlewares = kernel?.middlewares() || [];
    const globalGuards = ModuleBuilder.buildGlobalGuardProviders(
      kernel?.guards() || [],
    );

    @Module({
      imports: container.scanImports(),
      providers: [...providers, ...globalGuards],
      controllers: controllers,
    })
    class AppModule implements NestModule {
      configure(consumer: MiddlewareConsumer) {
        if (!kernel) return;
        /**
         * Apply global middleware for all routes if any found.
         */
        if (globalMiddlewares.length) {
          consumer.apply(...globalMiddlewares).forRoutes('');
        }

        const middlewareConfigurator = new MiddlewareConfigurator();
        kernel.routeMiddlewares(middlewareConfigurator);
        /**
         * Apply route specific middlewares
         */
        if (middlewareConfigurator.hasAnyRule()) {
          for (const rule of middlewareConfigurator.getAllRules()) {
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
