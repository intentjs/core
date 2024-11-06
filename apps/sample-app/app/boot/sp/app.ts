import {
  IntentApplication,
  IntentApplicationContext,
  ServiceProvider,
} from '@intentjs/core';
import { UserDbRepository } from 'app/repositories/userDbRepository';
import { UserService } from 'app/services';
import { AuthService } from 'app/services/auth';

export class AppServiceProvider extends ServiceProvider {
  /**
   * Register any application services here.
   */
  register() {
    /**
     * Binding the UserService with the application.
     *
     * Read more - https://tryintent.com/docs/providers
     */
    this.bind(UserService);

    this.bind(AuthService);
    /**
     * Binding the UserDbRepository with a non-class based token 'USER_DB_REPO'.
     *
     * Read more - https://tryintent.com/docs/providers#class-based-providers
     */
    this.bindWithClass('USER_DB_REPO', UserDbRepository);
  }

  /**
   * Bootstrap any application service here.
   */
  boot(app: IntentApplication | IntentApplicationContext) {}
}
