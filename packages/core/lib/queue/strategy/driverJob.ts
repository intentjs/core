export abstract class DriverJob {
  constructor(public data: Record<string, any>) {}

  public abstract getId(): string;

  public abstract getMessage(): string;
}
