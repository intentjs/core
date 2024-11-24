import { Request as HyperRequest } from 'hyper-express';
import { processMultipartData } from './multipart-handler';
import { INTENT_REQUEST_EXTENSIONS } from './extension';
import { ConfigService } from '../../../config/service';

export const requestMiddleware = async (
  req: HyperRequest,
  res: any,
  next: () => void,
) => {
  Object.assign(req, INTENT_REQUEST_EXTENSIONS);

  const enabledParsers = (ConfigService.get('http.parsers') as string[]) || [];
  const contentType = req.headers['content-type'] || '';

  try {
    if (enabledParsers.includes('json') && contentType === 'application/json') {
      req.body = await req.json();
    } else if (
      enabledParsers.includes('urlencoded') &&
      contentType === 'application/x-www-form-urlencoded'
    ) {
      req.body = await req.urlencoded();
    } else if (
      enabledParsers.includes('formdata') &&
      contentType.includes('multipart/form-data')
    ) {
      req.body = await processMultipartData(req);
    } else if (
      enabledParsers.includes('plain') &&
      contentType === 'text/plain'
    ) {
      req.body = await req.text();
    } else if (
      (enabledParsers.includes('html') && contentType === 'text/html') ||
      (enabledParsers.includes('xml') && contentType === 'application/xml')
    ) {
      req.body = (await req.buffer()).toString();
    } else {
      req.body = await req.buffer();
    }
  } catch (error) {
    console.error('Request parsing error:', error);
  }

  next();
};
