import { Injectable, ListensTo } from '@intentjs/core';

@Injectable()
export class OrderPlacedListener {
  @ListensTo('order_placed')
  async handle(data: Record<string, any>): Promise<void> {
    console.log('data ==> ', data);
    // write your code here...
  }
}
