export type ConfigurationInterface = {
  sourceRoot: string;
  serverFile: string;
  debug?: boolean;
  buildOptions?: {
    deleteOutDir: boolean;
  };
};
