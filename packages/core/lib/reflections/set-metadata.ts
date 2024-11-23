/* eslint-disable @typescript-eslint/ban-types */
export const SetMetadata = <K = string, V = any>(
  metadataKey: K,
  metadataValue: V,
) => {
  const decoratorFn = (
    target: object | Function,
    key?: string | symbol,
    descriptor?: any,
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
      return descriptor;
    }

    Reflect.defineMetadata(metadataKey, metadataValue, target);
    return target;
  };

  decoratorFn.KEY = metadataKey;
  return decoratorFn;
};
