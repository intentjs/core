import {
  Accepts,
  Body,
  Controller,
  Get,
  Host,
  IP,
  Param,
  Post,
  Query,
  Req,
  UseGuard,
} from '@intentjs/core';
import { CustomGuard } from '../guards/custom';
import { Request } from '@intentjs/core/dist/lib/rest/http-server/request';

@Controller('/icon')
@UseGuard(CustomGuard)
export class IntentController {
  constructor() {}

  @Get('/:name')
  @UseGuard(CustomGuard)
  async getHello(
    @Req() req: Request,
    @Query() query: Record<string, any>,
    @Query('b') bQuery: string,
    @Param('name') name: string,
    @Param() pathParams: string,
    @Host() hostname: string,
    @IP() ips: string,
    @Accepts() accepts: string,
  ) {
    // console.log(
    //   await req.file('file1'),
    //   await req.file('file2'),
    //   query,
    //   bQuery,
    //   name,
    //   pathParams,
    //   hostname,
    //   accepts,
    //   ips,
    //   'inside post method',
    // );
    // throw new Error('hello there');
    return { hello: 'world' };
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
    @Query() query: Record<string, any>,
    @Query('b') bQuery: string,
    @Param('name') name: string,
    @Param() pathParams: string,
    @Host() hostname: string,
    @IP() ips: string,
    @Accepts() accepts: string,
    @Body() body: any,
  ) {
    console.log('inside post method');
    console.log(
      await req.file('file1'),
      await req.file('file2'),
      // query,
      // bQuery,
      // name,
      // pathParams,
      // hostname,
      // accepts,
      // ips,
      // 'inside post method',
      // body,
    );
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
