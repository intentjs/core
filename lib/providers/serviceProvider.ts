import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
} from '@nestjs/common';
import { IntentApplication, Type } from '../interfaces';

export type ImportType =
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference;

export abstract class ServiceProvider {
  private providers: Provider[] = [];
  private controllers: Type<any>[] = [];
  private imports: ImportType[] = [];

  getAllImports(): ImportType[] {
    return this.imports;
  }

  getAllControllers(): Type<any>[] {
    return this.controllers;
  }

  getAllProviders(): Provider[] {
    return this.providers;
  }

  import(...imports: ImportType[]): this {
    this.imports.push(...imports);
    return this;
  }

  registerController(...controllers: Type<any>[]): this {
    this.controllers.push(...controllers);
    return this;
  }

  provide(...cls: Provider[]): this {
    this.providers.push(...cls);
    return this;
  }

  provideWithValue(token: string | symbol | Type<any>, valueFn: any): this {
    this.providers.push({ provide: token, useValue: valueFn });
    return this;
  }

  provideWithClass(token: string | symbol | Type<any>, cls: Type<any>): this {
    this.providers.push({
      provide: token,
      useClass: cls,
    });
    return this;
  }

  provideExisting(token: string, cls: Type<any>): this {
    this.providers.push({ provide: token, useExisting: cls });
    return this;
  }

  provideWithFactory<T>(
    token: string | symbol | Type<any>,
    factory: (...args: any[]) => T | Promise<T>,
    inject?: Array<InjectionToken | OptionalFactoryDependency>,
  ) {
    this.providers.push({ provide: token, useFactory: factory, inject });
  }

  /**
   * Use this method to register any provider.
   */
  abstract register();

  /**
   * Use this method to run
   */
  abstract boot(app: IntentApplication);
}
