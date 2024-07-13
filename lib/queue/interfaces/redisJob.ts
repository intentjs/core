import { DriverJob } from '../strategy';

export class RedisJob extends DriverJob {
  public getMessage(): string {
    return this.data.message;
  }
}
