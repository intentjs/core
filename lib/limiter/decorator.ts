export const Limit = (tokens: number, seconds: number) => {
  console.log('first(): factory evaluated');
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata('rate-limiter-tokens', tokens, target, propertyKey),
      Reflect.defineMetadata(
        'rate-limiter-interval',
        seconds,
        target,
        propertyKey,
      ),
      console.log('first(): called', propertyKey, descriptor, target);

    // var originalMethod = descriptor.value;

    // descriptor.value = function (...args: any[]) {
    //   console.log('Rate Limited');
    //   //   Limiter.useToken(funcKey);
    //   return originalMethod.apply(target, args);
    // };

    return descriptor;
  };
};
