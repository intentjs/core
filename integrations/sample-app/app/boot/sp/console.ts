import {
  IntentApplication,
  IntentApplicationContext,
  ServiceProvider,
} from '@intentjs/core';
import { TestCacheConsoleCommand } from 'app/console/cache';
import { GreetingCommand } from 'app/console/greeting';

export class ConsoleServiceProvider extends ServiceProvider {
  /**
   * Register any application services here.
   */
  register() {
    this.bind(GreetingCommand, TestCacheConsoleCommand);
  }

  /**
   * Bootstrap any application service here.
   */
  boot(app: IntentApplication | IntentApplicationContext) {}
}
