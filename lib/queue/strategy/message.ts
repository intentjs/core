export type Payload = Record<string, any> | string | number;

export interface JobOptions {
  delay?: number;
  tries?: number;
  queue?: string;
  timeout?: number;
  connection?: string;
}

export interface Message extends JobOptions {
  job: string;
  data: Payload | Payload[];
}

export interface InternalMessage extends Message {
  attemptCount: number;
}
