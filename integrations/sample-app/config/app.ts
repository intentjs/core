import {
  AppConfig,
  registerNamespace,
  toBoolean,
  ValidationErrorSerializer,
} from '@intentjs/core';

export default registerNamespace(
  'app',
  (): AppConfig => ({
    /**
     * -----------------------------------------------------
     * Application Name
     * -----------------------------------------------------
     *
     * This value is the name of your application. This value is
     * used when the framework needs to place the application's
     * name in a notification or any other location as required.
     */
    name: process.env.APP_NAME || 'Intent App',

    /**
     * -----------------------------------------------------
     * Application Environment
     * -----------------------------------------------------
     *
     * This value determines the "environment" your application
     * is running in. You may set this value in ".env" file.
     */
    env: process.env.APP_ENV || 'local',

    /**
     * -----------------------------------------------------
     * Application Debug Mode
     * -----------------------------------------------------
     *
     * When your application is in debug mode, Intent will try
     * to generate detailed error messages of any task failing.
     */
    debug: toBoolean(process.env.APP_DEBUG || true),

    /**
     * -----------------------------------------------------
     * Application URL
     * -----------------------------------------------------
     *
     * This URL is used by the console to generate complete
     * accessible URLs for your application.
     */
    url: process.env.APP_URL || 'localhost',

    /**
     * -----------------------------------------------------
     * Application Port
     * -----------------------------------------------------
     *
     * This value is the port on which the server will listen
     * to all incoming requests. You may set this value in
     * ".env" file.
     */
    port: +process.env.APP_PORT || 5000,

    /**
     * -----------------------------------------------------
     * Cross Origin Resource Sharing
     * -----------------------------------------------------
     *
     * You can use this setting to define the CORS rule of
     * your application.
     */
    cors: { origin: true },

    error: {
      /**
       * -----------------------------------------------------
       * Validation Serializer
       * -----------------------------------------------------
       *
       * This property defines the serializer class that will be
       * used to parse the validation errors. The value returned
       * from this class shall be thrown in the response object
       * whenever theier is a validation failure.
       */
      validationErrorSerializer: ValidationErrorSerializer,
    },

    /**
     * -----------------------------------------------------
     * Sentry Configuration
     * -----------------------------------------------------
     *
     * Intent comes with Sentry integration out of the box.
     * You can use Sentry to log errors that might come in your
     * application.
     *
     * You can get these values from your Sentry console.
     */
    sentry: {
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      integrateNodeProfile: true,
    },
  }),
);
