import { Type } from '../../../interfaces';
import { RequestMethod } from '../../http-server/methods';
import { IntentMiddleware } from './middleware';

type MiddlewareRuleApplicationInfo =
  | string
  | Type<any>
  | { path: string; method: RequestMethod };

export class MiddlewareConfigurator {
  private rules: { [key: string]: MiddlewareRule } = {};

  use(middleware: Type<IntentMiddleware>): MiddlewareRule {
    if (this.rules[middleware.name]) {
      return this.rules[middleware.name];
    }

    const rule = new MiddlewareRule(middleware);
    this.rules[middleware.name] = rule;
    return rule;
  }

  hasAnyRule(): boolean {
    return !!Object.keys(this.rules).length;
  }

  getAllRules(): MiddlewareRule[] {
    return Object.values(this.rules);
  }
}

export class MiddlewareRule {
  public appliedFor: Array<MiddlewareRuleApplicationInfo> = [];
  public excludedFor: Array<string | { path: string; method: RequestMethod }> =
    [];

  constructor(public middleware: Type<IntentMiddleware>) {}

  for(...path: MiddlewareRuleApplicationInfo[]): this {
    this.appliedFor.push(...path);
    return this;
  }

  exclude(
    ...path: Array<string | { path: string; method: RequestMethod }>
  ): this {
    this.excludedFor.push(...path);
    return this;
  }
}
