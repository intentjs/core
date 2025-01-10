export const joinRoute = (...paths: string[]) =>
  paths.join('/').replace(/[/]+/g, '/');
