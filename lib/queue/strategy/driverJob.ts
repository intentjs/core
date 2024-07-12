export abstract class DriverJob {
  constructor(public data: Record<string, any>) {}

  public abstract getMessage(): string;
}
