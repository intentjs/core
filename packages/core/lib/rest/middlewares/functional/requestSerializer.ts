import { NextFunction, Request, Response } from 'express';
import { RequestMixin } from '../../foundation/request-mixin';

export const requestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Object.assign(req, RequestMixin(req));
  next();
};
