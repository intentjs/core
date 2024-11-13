import {
  IntentApplication,
  IntentApplicationContext,
  ServiceProvider,
} from '@intentjs/core';
import { TestCacheConsoleCommand } from 'app/console/cache';
import { GreetingCommand } from 'app/console/greeting';
import { TestLogConsoleCommand } from 'app/console/log';
import { TestQueueConsoleCommand } from 'app/console/queue';
import { TestStorageConsoleCommand } from 'app/console/storage';

export class ConsoleServiceProvider extends ServiceProvider {
  /**
   * Register any application services here.
   */
  register() {
    this.bind(GreetingCommand, TestCacheConsoleCommand);
    this.bind(TestStorageConsoleCommand);
    this.bind(TestLogConsoleCommand);
    this.bind(TestQueueConsoleCommand);
  }

  /**
   * Bootstrap any application service here.
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  boot(app: IntentApplication | IntentApplicationContext) {}
}
