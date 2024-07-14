export class CannotParseAsJsonException extends Error {
  constructor() {
    super(`data cannot be parsed as json.`);
  }
}
