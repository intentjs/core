import { findProjectRoot, HttpConfig, registerNamespace } from '@intentjs/core';
import { join } from 'path';

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

    staticServe: {
      httpPath: 'assets',
      filePath: join(findProjectRoot(), 'storage/uploads'),
      keep: {
        extensions: ['css', 'js', 'json', 'png', 'jpg', 'jpeg'],
      },
      cache: {
        max_file_count: 1000,
        max_file_size: 4 * 1024 * 1024,
      },
    },
  }),
);
