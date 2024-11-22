import { GenericClass } from '../../../interfaces';
import { HttpExecutionContext } from './contexts/http-execution-context';

export class ExecutionContext {
  constructor(
    private protocolContext: HttpExecutionContext,
    private readonly handlerClass: GenericClass,
    private readonly handlerMethod: Function,
  ) {}

  getClass(): GenericClass {
    return this.handlerClass;
  }

  getHandler(): Function {
    return this.handlerMethod;
  }

  switchToHttp(): HttpExecutionContext {
    return this.protocolContext;
  }
}
