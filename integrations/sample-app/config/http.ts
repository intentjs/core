import { HttpConfig, registerNamespace } from '@intentjs/core';

export default registerNamespace(
  'http',
  (): HttpConfig => ({
    /**
     * -----------------------------------------------------
     * Parser
     * -----------------------------------------------------
     *
     * This value is the name of your application. This value is
     * used when the framework needs to place the application's
     * name in a notification or any other location as required.
     */
    parsers: ['json', 'formdata', 'plain', 'urlencoded'],

    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },

    server: {
      max_body_buffer: 100000000,
      max_body_length: 100000000,
    },
  }),
);
