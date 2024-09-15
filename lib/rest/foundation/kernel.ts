/* eslint-disable @typescript-eslint/no-unused-vars */
import { IntentApplication, Type } from '../../interfaces';
import { IntentGuard } from './guards/baseGuard';
import { MiddlewareConfigurator } from './middlewares/configurator';
import { IntentMiddleware } from './middlewares/middleware';

export abstract class Kernel {
  public controllers(): Type<any>[] {
    return [];
  }

  public middlewares(): Type<IntentMiddleware>[] {
    return [];
  }

  public routeMiddlewares(configurator: MiddlewareConfigurator) {}

  public guards(): Type<IntentGuard>[] {
    return [];
  }

  public abstract boot(app: IntentApplication): Promise<void>;
}
