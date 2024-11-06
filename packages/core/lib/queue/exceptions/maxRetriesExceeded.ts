export class MaxRetriesExceeded extends Error {
  constructor(
    public job: string,
    public data: any,
  ) {
    super(`Job [${job}] as exceeded it's max retries`);
  }
}
