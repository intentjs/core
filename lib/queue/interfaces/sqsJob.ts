import { DriverJob } from '../strategy';

export class SqsJob extends DriverJob {
  public getMessage(): string {
    return this.data.Body;
  }
}
