import { Request } from '@intentjs/hyper-express';
import { ExecutionContext, IntentGuard } from '../rest';
import { Reflector } from '../reflections';
import { Injectable } from '../foundation/decorators';

@Injectable()
export class IntentValidationGuard extends IntentGuard {
  constructor() {
    super();
  }

  async guard(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const reflector = context.getReflector();
    const schema = reflector.getFromMethod('dtoSchema');
    console.log(schema);
    await request.validate(schema);
    return true;
  }
}
