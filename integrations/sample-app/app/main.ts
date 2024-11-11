import { HttpKernel } from './http/kernel';
import { ApplicationContainer } from './boot/container';
import { ApplicationExceptionFilter } from './errors/filter';
import { IntentHttpServer } from '@intentjs/core';

IntentHttpServer.init()
  .useContainer(ApplicationContainer)
  .useKernel(HttpKernel)
  .handleErrorsWith(ApplicationExceptionFilter)
  .start();
