import { NextFunction, Request, Response } from 'express';
import { IntentRequest } from '../request';
import { IntentResponse } from '../response';

export const requestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req['$intent'] = {
    req: new IntentRequest(req),
    res: new IntentResponse(res),
  };
  next();
};
