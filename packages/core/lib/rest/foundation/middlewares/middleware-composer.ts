import { ModuleRef } from '@nestjs/core';
import { Type } from '../../../interfaces';
import { MiddlewareConfigurator } from './configurator';
import { IntentMiddleware } from './middleware';
import { CONTROLLER_KEY } from '../../http-server/constants';

export class MiddlewareComposer {
  private middlewareRoute = new Map<string, any>();
  private middlewareMap: Record<string, IntentMiddleware> = {};

  constructor(
    private moduleRef: ModuleRef,
    private middlewareConfigurator: MiddlewareConfigurator,
    private middlewares: Type<IntentMiddleware>[],
  ) {}

  async handle() {
    /**
     * Prepares a map like
     *
     * "GET:/route" => Middleware Collection
     * "*:/route" => Middleware Collection
     */
    const routeMethodBasedMiddlewares = {};
    for (const rule of this.middlewareConfigurator.getAllRules()) {
      const applyMiddlewareFor = [];

      for (const appliedFor of rule.appliedFor) {
        let routeUniqueKey = undefined;
        if (typeof appliedFor === 'string') {
          console.log(appliedFor);
          routeUniqueKey = `*:${appliedFor}`;
          await this.setMiddlewareForRoute(routeUniqueKey, rule.middleware);
        } else if (
          typeof appliedFor === 'object' &&
          appliedFor.path &&
          appliedFor.method
        ) {
          routeUniqueKey = `${appliedFor.method}:${appliedFor.path}`;
          this.setMiddlewareForRoute(routeUniqueKey, rule.middleware);
        } else {
          const controller = Reflect.getMetadata(CONTROLLER_KEY, appliedFor);
        }
      }

      console.log(this.middlewareRoute);

      //   const methodNames = this.metadataScanner.getAllMethodNames(instance);
      //   for (const methodName of methodNames) {
      //     const route = await this.scanFullRoute(
      //       instance,
      //       methodName,
      //       errorHandler,
      //     );
      //     route && routes.push(route);
      //   }
    }

    console.log(this.middlewares, this.middlewareConfigurator);
  }

  async setMiddlewareForRoute(
    routeKey: string,
    middleware: Type<IntentMiddleware>,
  ) {
    const existingMiddlewares = this.middlewareRoute.get(routeKey) as any[];
    if (existingMiddlewares) {
      const middlewareInstance = await this.moduleRef.create(middleware);
      this.middlewareRoute.set(
        routeKey,
        existingMiddlewares.concat(middlewareInstance),
      );
      return;
    }

    const middlewareInstance = await this.moduleRef.create(middleware);
    this.middlewareRoute.set(routeKey, [middlewareInstance]);
  }
}
