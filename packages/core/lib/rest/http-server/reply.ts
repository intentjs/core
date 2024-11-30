import { Request, Response } from '@intentjs/hyper-express';
import { HttpStatus } from './status-codes';
import { isClass, isUndefined } from '../../utils/helpers';
import { StreamableFile } from './streamable-file';
import { Obj } from '../../utils';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class Reply {
  async handle(req: Request, res: Response, dataFromHandler: any) {
    const { method } = req;

    /**
     * Set the status code of the response
     */
    if (!res.statusCode && method === 'POST') {
      res.status(HttpStatus.CREATED);
    } else if (!res.statusCode) {
      res.status(HttpStatus.OK);
    }

    if (dataFromHandler instanceof StreamableFile) {
      const headers = dataFromHandler.getHeaders();
      if (
        isUndefined(res.getHeader('Content-Type')) &&
        !isUndefined(headers.type)
      ) {
        res.header('Content-Type', headers.type);
      }
      if (
        isUndefined(res.getHeader('Content-Disposition')) &&
        !isUndefined(headers.type)
      ) {
        res.header('Content-Disposition', headers.disposition);
      }

      if (
        isUndefined(res.getHeader('Content-Length')) &&
        !isUndefined(headers.length)
      ) {
        res.header('Content-Length', headers.length + '');
      }

      return res.stream(dataFromHandler.getStream());
    }

    /**
     * Default to JSON
     */
    let plainData = Array.isArray(dataFromHandler)
      ? dataFromHandler.map(r => this.transformToPlain(r))
      : this.transformToPlain(dataFromHandler);

    // console.log(plainData);
    // console.time('time_to_detect_object');
    // console.log(Obj.isObj(dataFromHandler), instanceToPlain(dataFromHandler));
    // console.timeEnd('time_to_detect_object');
    if (typeof plainData != null && typeof plainData === 'object') {
      return res.json(plainData);
    }

    return res.send(String(plainData));
  }

  transformToPlain(plainOrClass: any) {
    if (!plainOrClass) return plainOrClass;
    return instanceToPlain(plainOrClass);
  }
}
