import {
  Accepts,
  Body,
  BufferBody,
  Controller,
  File,
  findProjectRoot,
  Get,
  Header,
  Host,
  IP,
  Param,
  Post,
  Query,
  Req,
  Res,
  Response,
  StreamableFile,
  UseGuard,
  UserAgent,
} from '@intentjs/core';
import { CustomGuard } from '../guards/custom';
import { Request, UploadedFile } from '@intentjs/hyper-express';
import { CustomParam } from '../decorators/custom-param';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';

@Controller('/icon')
@UseGuard(CustomGuard)
export class IntentController {
  public service: any;

  constructor() {
    this.service = null;
  }

  @Get('/:name')
  @UseGuard(CustomGuard)
  async getHello(
    // @Req() req: Request,
    // @Param('name') name: string,
    // @Query() query: Record<string, any>,
    // @Query('b') bQuery: string,
    // @Param() pathParams: string,
    // @Host() hostname: string,
    // @IP() ips: string,
    // @Accepts() accepts: string,
    // @BufferBody() bufferBody: Promise<Buffer>,
    // @UserAgent() userAgent: string,
    // @Header() headers: Record<string, any>,
    @Res() res: Response,
  ) {
    // console.log(
    //   'query ==> ',
    //   query,
    //   'bQuyery ==> ',
    //   bQuery,
    //   'name ===> ',
    //   name,
    //   bufferBody,
    //   pathParams,
    //   'hostname===> ',
    //   hostname,
    //   'accepts ===> ',
    //   accepts,
    //   'ips ===> ',
    //   ips,
    //   'inside get method',
    //   'user agent ===> ',
    //   userAgent,
    // );

    // console.log('all headers ===> ', headers);
    // throw new Error('hello there');
    const readStream = createReadStream(
      join(findProjectRoot(), 'storage/uploads/sample-image.jpg'),
    );

    return new StreamableFile(readStream, { type: 'image/jpeg' });
  }

  @Get('/plain-with-query-param')
  @UseGuard(CustomGuard)
  async plainWithQueryParam(@Req() req: Request) {
    console.log(req);
    return { hello: 'world' };
  }

  @Get('/:id')
  @UseGuard(CustomGuard)
  async plainWithPathParam(@Req() req: Request) {
    console.log(req);
    return { hello: 'world' };
  }

  @Post('/json')
  async postJson(
    @Req() req: Request,
    @Param('name') name: string,
    @Query() query: Record<string, any>,
    @Query('b') bQuery: string,
    @Param() pathParams: string,
    @Host() hostname: string,
    @IP() ips: string,
    @Accepts() accepts: string,
    @BufferBody() bufferBody: Promise<Buffer>,
    @UserAgent() userAgent: string,
    @Header() headers: Record<string, any>,
    @File('file') file: UploadedFile,
    @Res() res: Response,
  ) {
    console.log(
      'query ==> ',
      query,
      'bQuyery ==> ',
      bQuery,
      'name ===> ',
      name,
      bufferBody,
      pathParams,
      'hostname===> ',
      hostname,
      'accepts ===> ',
      accepts,
      'ips ===> ',
      ips,
      'inside get method',
      'user agent ===> ',
      userAgent,
    );

    console.log('all headers ===> ', headers);
    console.log('uploaded files ==> ', file);

    const readStream = createReadStream(
      join(findProjectRoot(), 'storage/uploads/sample-image.jpg'),
    );

    return new StreamableFile(readStream, { type: 'image/jpeg' });
    return res.stream(new StreamableFile(readStream, { type: 'image/jpeg' }));

    return { hello: 'world from POST /json' };
  }

  @Post('/multipart')
  @UseGuard(CustomGuard)
  async postHello(@Req() req: Request) {
    return { hello: 'world' };
  }

  @Post('/form-data')
  @UseGuard(CustomGuard)
  async postFormData(@Req() req: Request) {
    return { hello: 'world' };
  }

  @Post('/binary')
  @UseGuard(CustomGuard)
  async postBinary(@Req() req: Request) {
    return { hello: 'world' };
  }
}
