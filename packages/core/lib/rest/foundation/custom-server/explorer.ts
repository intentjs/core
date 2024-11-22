import { DiscoveryService, MetadataScanner, ModuleRef } from '@nestjs/core';
import {
  CONTROLLER_KEY,
  GUARD_KEY,
  HttpMethods,
  METHOD_KEY,
  METHOD_PATH,
} from './decorators';
import { join } from 'path';
import { IntentGuard } from '../guards/base-guard';
import { Type } from '../../../interfaces';
import { HttpRouteHandler } from './http-handler';
import { ResponseHandler } from './response-handler';
import { ExecutionContext } from './execution-context';
import { HttpExecutionContext } from './contexts/http-execution-context';
import HyperExpress, { Request, Response } from 'hyper-express';

export class CustomServer {
  private hyper = new HyperExpress.Server();

  async build(
    discoveryService: DiscoveryService,
    metadataScanner: MetadataScanner,
    moduleRef: ModuleRef,
  ): Promise<HyperExpress.Server> {
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
        await this.exploreRoutes(instance, methodName, moduleRef);
      }
    }

    return this.hyper;
  }

  async exploreRoutes(instance: any, key: string, moduleRef: ModuleRef) {
    const controllerKey = Reflect.getMetadata(
      CONTROLLER_KEY,
      instance.constructor,
    );
    if (!controllerKey) return;
    const pathMethod = Reflect.getMetadata(METHOD_KEY, instance, key);
    const methodPath = Reflect.getMetadata(METHOD_PATH, instance, key);
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
    for (const guardType of composedGuardTypes) {
      composedGuards.push(await moduleRef.create(guardType));
    }

    const middlewares = [];

    const handler = new HttpRouteHandler(
      middlewares,
      composedGuards,
      methodRef,
    );

    const responseHandler = new ResponseHandler();

    const cb = async (hReq: Request, hRes: Response) => {
      const now = performance.now();
      const httpContext = new HttpExecutionContext(hReq, hRes);
      const executionContext = new ExecutionContext(
        httpContext,
        instance,
        methodRef,
      );

      const resFromHandler = await handler.handle(executionContext);

      const [type, res] = await responseHandler.handle(
        hReq,
        hRes,
        resFromHandler,
      );

      if (type === 'json') {
        hRes
          .header('Content-Type', 'application/json')
          .send(JSON.stringify(res));
      }

      console.log(
        'time to handle one http request ===> ',
        performance.now() - now,
      );
    };

    const fullPath = join(controllerKey, methodPath);
    switch (pathMethod) {
      case HttpMethods.GET:
        this.hyper.get(fullPath, cb);
        break;

      case HttpMethods.POST:
        this.hyper.post(fullPath, cb);
        break;

      case HttpMethods.DELETE:
        this.hyper.delete(fullPath, cb);
        break;

      case HttpMethods.HEAD:
        this.hyper.head(fullPath, cb);
        break;

      case HttpMethods.PUT:
        this.hyper.put(fullPath, cb);
        break;

      case HttpMethods.PATCH:
        this.hyper.patch(fullPath, cb);
        break;

      case HttpMethods.OPTIONS:
        this.hyper.options(fullPath, cb);
        break;

      case HttpMethods.ANY:
        this.hyper.any(fullPath, cb);
        break;
    }
  }
}
