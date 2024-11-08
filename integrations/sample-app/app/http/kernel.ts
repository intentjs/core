import {
  CorsMiddleware,
  HelmetMiddleware,
  IntentApplication,
  IntentGuard,
  IntentMiddleware,
  Kernel,
  MiddlewareConfigurator,
  Type,
} from '@intentjs/core';
import { UserController } from './controllers/app';
import { AuthController } from './controllers/auth';

export class HttpKernel extends Kernel {
  /**
   * Global registry for all of the controller classes.
   * Read more - https://tryintent.com/docs/controllers
   */
  public controllers(): Type<any>[] {
    return [UserController, AuthController];
  }

  /**
   * Register all of your global middlewares here.
   * Middlewares added in the return array will be
   * applied to all routes by default.
   *
   * Read more - https://tryintent.com/docs/middlewares
   */
  public middlewares(): Type<IntentMiddleware>[] {
    return [CorsMiddleware, HelmetMiddleware];
  }

  /**
   * Register all of your route based middlewares here.
   * You can apply middlewares to group of routes, controller classes
   * or exclude them.
   *
   * Read more - https://tryintent.com/docs/middlewares
   */
  public routeMiddlewares(configurator: MiddlewareConfigurator) {
    return;
  }

  /**
   * Register all of your global guards here.
   * Guards added in the return array will be
   * applied to all routes by default.
   *
   * Read more - https://tryintent.com/docs/guards
   */
  public guards(): Type<IntentGuard>[] {
    return [];
  }

  /**
   * @param app
   */
  public async boot(app: IntentApplication): Promise<void> {
    app.disable('x-powered-by');
  }
}
