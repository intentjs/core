import { ConfigurationInterface } from "../configuration/interface";
import { ExtraOptions } from "../interfaces";

export const defaultSwcOptionsFactory = (
  tsOptions: Record<string, any>,
  configuration: ConfigurationInterface,
  extras: ExtraOptions
): Record<string, any> => {
  return {
    sourceMaps:
      tsOptions?.compilerOptions?.sourceMap ||
      (tsOptions?.inlineSourceMap && "inline"),
    module: {
      type: "commonjs",
    },
    exclude: ["node_modules", "dist"],
    jsc: {
      target: "es2021",
      parser: {
        syntax: "typescript",
        tsx: true,
        decorators: true,
        dynamicImport: true,
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
        useDefineForClassFields: false,
      },
      keepClassNames: true,
      baseUrl: tsOptions?.compilerOptions?.baseUrl,
      paths: tsOptions?.compilerOptions?.paths,
    },
    minify: false,
    swcrc: true,
  };
};
