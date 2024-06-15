import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { Command } from '../console';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

import { promisify } from 'node:util';
const pipe = promisify(pipeline);

async function do_gzip(input: string, output: string) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipe(source, gzip, destination);
}

@Injectable()
export class LoggerConsoleCommands {
  /**
   * Command to zip the logs
   */
  @Command('logger:rotate-log', {
    desc: 'Command to rotate logs',
  })
  public async rotateLog(): Promise<void> {
    const logsDir = path.join(process.cwd(), 'log');
    const zipDir = path.join(logsDir, 'zip');

    // Create the zip directory if it doesn't exist
    if (!fs.existsSync(zipDir)) {
      fs.mkdirSync(zipDir);
    }

    // Read all .log files in the logs directory
    const logFiles = fs.readdirSync(logsDir).filter((file) => {
      return path.extname(file) === '.log';
    });

    // Compress each log file and save it to the zip directory

    for (const logFile of logFiles) {
      try {
        const logFilePath = path.join(logsDir, logFile);
        const zipFilePath = path.join(zipDir, `${logFile}-${new Date()}.zip`);
        await do_gzip(logFilePath, zipFilePath);
        fs.readFileSync(logFilePath);

        //clear the log file
        fs.truncateSync(logFilePath);
      } catch (err) {
        console.error('An error occurred:', err);
        process.exitCode = 1;
      }
    }
  }
}
