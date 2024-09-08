import { IntentApplication, Type } from '../../interfaces';
import { IntentGuard } from './guards/baseGuard';
import { MiddlewareConfigurator } from './middlewares/configurator';
import { IntentMiddleware } from './middlewares/middleware';

export abstract class Kernel {
  public middlewares(): Type<IntentMiddleware>[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public middlewareGroups(configurator: MiddlewareConfigurator) {}

  public guards(): Type<IntentGuard>[] {
    return [];
  }

  public abstract boot(app: IntentApplication): Promise<void>;
}
