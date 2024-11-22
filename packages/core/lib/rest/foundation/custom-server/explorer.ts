import { DiscoveryService, MetadataScanner, ModuleRef } from '@nestjs/core';
import { Context, Hono } from 'hono';
import { serve } from '@hono/node-server';
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
import { exec } from 'child_process';

export class CustomServer {
  private hono = new Hono();

  async build(
    discoveryService: DiscoveryService,
    metadataScanner: MetadataScanner,
    moduleRef: ModuleRef,
  ): Promise<Hono> {
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

    return this.hono;
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

    const cb = async (c: Context) => {
      const now = performance.now();
      const httpContext = new HttpExecutionContext(c);
      const executionContext = new ExecutionContext(
        httpContext,
        instance,
        methodRef,
      );

      const resFromHandler = await handler.handle(executionContext);

      const [type, res] = await responseHandler.handle(c, resFromHandler);

      console.log(
        'time to handle one http request ===> ',
        performance.now() - now,
      );

      if (type === 'json') return c.json(res);
      return c.json(res);
    };

    if (pathMethod === HttpMethods.GET) {
      this.hono.get(join(controllerKey, methodPath), cb);
    } else if (pathMethod === HttpMethods.POST) {
      this.hono.post(join(controllerKey, methodPath), cb);
    } else if (pathMethod === HttpMethods.PUT) {
      this.hono.put(join(controllerKey, methodPath), cb);
    } else if (pathMethod === HttpMethods.PATCH) {
      this.hono.patch(join(controllerKey, methodPath), cb);
    } else if (pathMethod === HttpMethods.DELETE) {
      this.hono.delete(join(controllerKey, methodPath), cb);
    } else if (pathMethod === HttpMethods.OPTIONS) {
      this.hono.options(join(controllerKey, methodPath), cb);
    } else if (pathMethod === HttpMethods.ANY) {
      this.hono.all(join(controllerKey, methodPath), cb);
    }
  }

  //   listen(port: number, hostname?: string);
  listen(port: number) {
    serve({
      port,
      fetch: this.hono.fetch,
    });
  }
}
