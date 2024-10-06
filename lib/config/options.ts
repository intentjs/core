export type RegisterNamespaceOptions = {
  dynamic?: boolean;
  encrypt?: boolean;
};

export type BuildConfigFromNS<T extends RegisterNamespaceReturnType<any, any>> =
  {
    [N in T as T['_']['namespace']]: T['$inferConfig'];
  };

export type RegisterNamespaceReturnType<
  N extends string,
  T extends Record<string, any>,
> = {
  _: {
    namespace: N;
    options: RegisterNamespaceOptions;
    factory: () => T | Promise<T>;
  };
  $inferConfig: T;
};

export type NamespacedConfigMapKeys =
  | 'factory'
  | 'static'
  | 'dynamic'
  | 'encrypt';

export type NamespacedConfigMapValues =
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function | object | boolean | string | number;

export type NamespacedConfigMap = Map<
  NamespacedConfigMapKeys,
  NamespacedConfigMapValues
>;
export type ConfigMap = Map<string, NamespacedConfigMap>;
