export type GenericFunction = (...args: any[]) => any;
export type GenericClass = Record<string, any>;

export interface ShouldBeQueued {
  queueOptions(): Record<string, any>;
}
