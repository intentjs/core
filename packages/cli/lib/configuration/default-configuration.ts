export const defaultIntentConfiguration = () => {
  return {
    sourceRoot: "app",
    containerFile: "main",
    serverFile: "server",
    debug: true,
    buildOptions: { deleteOutDir: true },
    swc: { configPath: ".swcrc" },
  };
};
