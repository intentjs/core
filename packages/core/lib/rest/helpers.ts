export const joinRoute = (...paths: string[]) => {
  const methodPath = paths[2];
  if (!methodPath) {
    return paths.slice(0, 2).join('/').replace(/\/+/g, '/');
  }
  return paths.join('/').replace(/\/+/g, '/');
};
