import uWS from 'uWebSockets.js';
import { HttpMethods } from './decorators';

export class Request {
  constructor(
    private raw: uWS.HttpRequest,
    private method: HttpMethods,
  ) {}
}
