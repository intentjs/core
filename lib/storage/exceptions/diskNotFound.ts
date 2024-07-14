export class DiskNotFoundException extends Error {
  constructor(config: Record<string, any>) {
    super(`${config.disk} not found`);
  }
}
