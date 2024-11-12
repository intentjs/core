import { fromIni } from '@aws-sdk/credential-providers';
import {
  findProjectRoot,
  registerNamespace,
  StorageOptions,
} from '@intentjs/core';
import { join } from 'path';

export default registerNamespace(
  'filesystem',
  (): StorageOptions =>
    ({
      /**
       * -----------------------------------------------------
       * Default Storage Disk
       * -----------------------------------------------------
       * Documentation - https://tryintent.com/docs/file-storage
       *
       * This value is the name of the default disk. This will be
       * used when you use the `Storage` facade to access your
       * files.
       */

      default: process.env.DEFAULT_STORAGE || 'local',

      /**
       * -----------------------------------------------------
       * Storage Disks
       * -----------------------------------------------------
       *
       * Here you can configure all your different storage disks.
       * A default configuration has been added for your application.
       * You can change the disk that you would want to use at the runtime.
       *
       * Storage Driver: "local", "s3"
       */
      disks: {
        local: {
          driver: 'local',
          basePath: join(findProjectRoot(), 'storage/uploads'),
        },

        s3: {
          driver: 's3',
          region: process.env.AWS_REGION,
          bucket: process.env.S3_BUCKET,
          credentials: fromIni({ profile: process.env.AWS_PROFILE }),
        },
      },
    }) as StorageOptions,
);
