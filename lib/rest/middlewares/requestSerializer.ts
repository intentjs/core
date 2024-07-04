import {
  NextFunction,
  Request as ERequest,
  Response as EResponse,
} from "express";
import { Request } from "../request";

export const requestMiddleware = (
  req: ERequest,
  res: EResponse,
  next: NextFunction
) => {
  const intentRequestObj = new Request(req);
  req["intent"] = {
    req: () => intentRequestObj,
  };
  next();
};
