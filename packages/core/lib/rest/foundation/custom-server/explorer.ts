import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import {
  CONTROLLER_KEY,
  HttpMethods,
  METHOD_KEY,
  METHOD_PATH,
} from './decorators';
import { join } from 'path';

export class CustomServer {
  private hono = new Hono();

  build(
    discoveryService: DiscoveryService,
    metadataScanner: MetadataScanner,
  ): this {
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
        this.exploreRoutes(instance, methodName);
      }
    }

    return this;
  }

  exploreRoutes(instance: any, key: string) {
    const controllerKey = Reflect.getMetadata(
      CONTROLLER_KEY,
      instance.constructor,
    );
    if (!controllerKey) return;
    const pathMethod = Reflect.getMetadata(METHOD_KEY, instance, key);
    const methodPath = Reflect.getMetadata(METHOD_PATH, instance, key);
    const methodRef = instance[key].bind(instance);

    if (pathMethod === HttpMethods.GET) {
      this.hono.get(join(controllerKey, methodPath), async c => {
        const res = await methodRef(c);
        return c.json(res);
      });
    }

    if (pathMethod === HttpMethods.POST) {
      this.hono.post(join(controllerKey, methodPath), async c => {
        const res = await methodRef(c);
        return c.json(res);
      });
    }
    if (pathMethod === HttpMethods.PUT) {
      this.hono.put(join(controllerKey, methodPath), async c => {
        const res = await methodRef(c);
        return c.json(res);
      });
    }
    if (pathMethod === HttpMethods.PATCH) {
      this.hono.patch(join(controllerKey, methodPath), async c => {
        const res = await methodRef(c);
        return c.json(res);
      });
    }
    if (pathMethod === HttpMethods.DELETE) {
      this.hono.delete(join(controllerKey, methodPath), async c => {
        const res = await methodRef(c);
        return c.json(res);
      });
    }

    if (pathMethod === HttpMethods.OPTIONS) {
      this.hono.options(join(controllerKey, methodPath), async c => {
        const res = await methodRef(c);
        return c.json(res);
      });
    }

    if (pathMethod === HttpMethods.ANY) {
      this.hono.all(join(controllerKey, methodPath), async c => {
        const res = await methodRef(c);
        return c.json(res);
      });
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
