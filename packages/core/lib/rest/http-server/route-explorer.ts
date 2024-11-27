import { DiscoveryService, MetadataScanner, ModuleRef } from '@nestjs/core';
import { join } from 'path';
import { HttpRoute } from './interfaces';
import { Response as HResponse, MiddlewareNext } from 'hyper-express';
import { HttpExecutionContext } from './contexts/http-execution-context';
import { HttpRouteHandler } from './http-handler';
import { Response } from './response';
import { ExecutionContext } from './contexts/execution-context';
import { Type } from '../../interfaces';
import {
  CONTROLLER_KEY,
  GUARD_KEY,
  METHOD_KEY,
  METHOD_PATH,
  ROUTE_ARGS,
} from './constants';
import { RouteArgType } from './param-decorators';
import { Request } from './request/interfaces';
import { IntentGuard } from '../foundation/guards/base-guard';
import { IntentMiddleware } from '../foundation/middlewares/middleware';
import { IntentExceptionFilter } from '../../exceptions/base-exception-handler';

export class RouteExplorer {
  guards: Type<IntentGuard>[] = [];

  globalMiddlewares: IntentMiddleware[] = [];
  routeMiddlewares: Map<string, IntentMiddleware[]>;
  excludedRouteMiddlewares: Map<string, string[]>;

  constructor(
    private discoveryService: DiscoveryService,
    private metadataScanner: MetadataScanner,
    private moduleRef: ModuleRef,
  ) {}

  async exploreFullRoutes(
    errorHandler: IntentExceptionFilter,
  ): Promise<HttpRoute[]> {
    const routes = [];
    const providers = this.discoveryService.getProviders();
    for (const provider of providers) {
      const { instance } = provider;
      //   if (
      //     !instance ||
      //     typeof instance === 'string' ||
      //     !Object.getPrototypeOf(instance)
      //   ) {
      //     return;
      //   }

      const methodNames = this.metadataScanner.getAllMethodNames(instance);
      for (const methodName of methodNames) {
        const route = await this.scanFullRoute(
          instance,
          methodName,
          errorHandler,
        );
        route && routes.push(route);
      }
    }

    return routes;
  }

  explorePlainRoutes(
    discoveryService: DiscoveryService,
    metadataScanner: MetadataScanner,
  ): HttpRoute[] {
    const routes = [];
    const providers = discoveryService.getProviders();
    for (const provider of providers) {
      const { instance } = provider;
      //   if (
      //     !instance ||
      //     typeof instance === 'string' ||
      //     !Object.getPrototypeOf(instance)
      //   ) {
      //     return;
      //   }

      const methodNames = metadataScanner.getAllMethodNames(instance);
      for (const methodName of methodNames) {
        const route = this.scanPlainRoute(instance, methodName);
        route && routes.push(route);
      }
    }

    return routes;
  }

  scanPlainRoute(instance: any, key: string): Record<string, any> {
    const controllerKey = Reflect.getMetadata(
      CONTROLLER_KEY,
      instance.constructor,
    );

    if (!controllerKey) return;

    const pathMethod = Reflect.getMetadata(METHOD_KEY, instance, key);
    const methodPath = Reflect.getMetadata(METHOD_PATH, instance, key);

    const fullHttpPath = join(controllerKey, methodPath);
    return { method: pathMethod, path: fullHttpPath };
  }

  async scanFullRoute(
    instance: any,
    key: string,
    errorHandler: IntentExceptionFilter,
  ): Promise<HttpRoute> {
    const controllerKey = Reflect.getMetadata(
      CONTROLLER_KEY,
      instance.constructor,
    );
    if (!controllerKey) return;
    const pathMethod = Reflect.getMetadata(METHOD_KEY, instance, key);
    const methodPath = Reflect.getMetadata(METHOD_PATH, instance, key);

    if (!pathMethod) return;

    const methodRef = instance[key].bind(instance);
    const controllerGuards = Reflect.getMetadata(
      GUARD_KEY,
      instance.constructor,
    );

    const methodGuards = Reflect.getMetadata(GUARD_KEY, instance, key);

    const composedGuardTypes = [
      ...(controllerGuards || []),
      ...(methodGuards || []),
    ] as Type<IntentGuard>[];

    const composedGuards = [];
    for (const globalGuard of this.guards) {
      composedGuards.push(await this.moduleRef.create(globalGuard));
    }

    for (const guardType of composedGuardTypes) {
      composedGuards.push(await this.moduleRef.create(guardType));
    }

    const middlewares = [];

    const routeArgs =
      Reflect.getMetadata(ROUTE_ARGS, instance.constructor, key) ||
      ([] as RouteArgType[]);

    const handler = new HttpRouteHandler(
      composedGuards,
      methodRef,
      errorHandler,
    );

    const cb = async (hReq: Request, hRes: HResponse, next: MiddlewareNext) => {
      const httpContext = new HttpExecutionContext(hReq, new Response());
      const context = new ExecutionContext(httpContext, instance, methodRef);

      const args = [];
      for (const routeArg of routeArgs) {
        args.push(
          routeArg.handler
            ? routeArg.handler(routeArg.data, context)
            : httpContext.getInjectableValueFromArgType(routeArg),
        );
      }

      const res = await handler.handle(context, args);
      res.reply(hReq, hRes);
    };

    return {
      method: pathMethod,
      path: join(controllerKey, methodPath),
      httpHandler: cb,
    };
  }

  useGlobalGuards(guards: Type<IntentGuard>[]): RouteExplorer {
    this.guards.push(...guards);
    return this;
  }

  useGlobalMiddlewares(globalMiddlewares: IntentMiddleware[]): RouteExplorer {
    this.globalMiddlewares = globalMiddlewares;
    return this;
  }

  useExcludeMiddlewareRoutes(
    routeMiddlewares: Map<string, string[]>,
  ): RouteExplorer {
    this.excludedRouteMiddlewares = routeMiddlewares;
    return this;
  }

  useRouteMiddlewares(
    routeMiddlewares: Map<string, IntentMiddleware[]>,
  ): RouteExplorer {
    this.routeMiddlewares = routeMiddlewares;
    return this;
  }
}
