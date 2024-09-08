import {
  NextFunction,
  Request as HRequest,
  Response as HResponse,
} from 'express';
import { Request } from '../../foundation';

export const requestMiddleware = (
  req: HRequest,
  res: HResponse,
  next: NextFunction,
) => {
  const intentRequestObj = new Request(req);
  req['intent'] = {
    req: () => intentRequestObj,
    res: () => () => {},
  };
  next();
};
