import { extname, join } from 'path';

import * as fs from 'fs-extra';

import {
  DiskOptions,
  FileOptions,
  StorageDriver,
  StorageDriver$FileMetadataResponse,
  StorageDriver$PutFileResponse,
  StorageDriver$RenameFileResponse,
} from '../interfaces';
import { ReadStream, createReadStream } from 'fs';

export class Local implements StorageDriver {
  constructor(
    private disk: string,
    private config: DiskOptions,
  ) {}

  /**
   * Put file content to the path specified.
   *
   * @param path
   * @param fileContent
   */
  async put(
    filePath: string,
    fileContent: any,
    options?: FileOptions,
  ): Promise<StorageDriver$PutFileResponse> {
    console.log(options);
    const res = await fs.outputFile(
      join(this.config.basePath || '', filePath),
      fileContent,
    );
    console.log(res);
    return { path: join(this.config.basePath || '', filePath), url: '' };
  }

  /**
   * Get file stored at the specified path.
   *
   * @param path
   */
  async get(filePath: string): Promise<Buffer> {
    return await fs.readFile(join(this.config.basePath || '', filePath));
  }

  /**
   * Get object's metadata
   * @param path
   */
  async meta(filePath: string): Promise<StorageDriver$FileMetadataResponse> {
    const path = join(this.config.basePath || '', filePath);
    const res = await fs.stat(path);
    return {
      path,
      contentLength: res.size,
      lastModified: res.mtime,
    };
  }

  /**
   * Get Signed Urls
   * @param path
   */
  signedUrl(filePath: string, expire = 10): string {
    console.log(expire);
    return '';
  }

  /**
   * Check if file exists at the path.
   *
   * @param path
   */
  async exists(filePath: string): Promise<boolean> {
    return fs.pathExists(join(this.config.basePath || '', filePath));
  }

  /**
   * Check if file is missing at the path.
   *
   * @param path
   */
  async missing(filePath: string): Promise<boolean> {
    return !(await this.exists(filePath));
  }

  /**
   * Get URL for path mentioned.
   *
   * @param path
   */
  url(fileName: string) {
    if (this.config.hasOwnProperty('baseUrl')) {
      const filePath = join('public', fileName);
      return `${this.config.basePath}/${filePath}`;
    } else {
      return '';
    }
  }

  /**
   * Delete file at the given path.
   *
   * @param path
   */
  async delete(filePath: string): Promise<boolean> {
    try {
      await fs.remove(join(this.config.basePath || '', filePath));
    } catch (e) {}
    return true;
  }

  getStream(filePath: string): ReadStream {
    const file = createReadStream(join(this.config.basePath || '', filePath));
    return file;
  }

  /**
   * Copy file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  async copy(
    path: string,
    newPath: string,
  ): Promise<StorageDriver$RenameFileResponse> {
    const res = await fs.copy(
      join(this.config.basePath || '', path),
      join(this.config.basePath || '', newPath),
      { overwrite: true },
    );
    return {
      path: join(this.config.basePath || '', newPath),
      url: this.url(newPath),
    };
  }

  /**
   * Move file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  async move(
    path: string,
    newPath: string,
  ): Promise<StorageDriver$RenameFileResponse> {
    await this.copy(path, newPath);
    await this.delete(path);
    return {
      path: join(this.config.basePath || '', newPath),
      url: this.url(newPath),
    };
  }

  /**
   * Get instance of driver's client.
   */
  getClient(): null {
    return null;
  }

  /**
   * Get config of the driver's instance.
   */
  getConfig(): Record<string, any> {
    return this.config;
  }

  async listDir(path: string): Promise<Record<string, any>> {
    const directory = join(this.config.basePath || '', path);
    const fileNames = await fs.readdir(directory);

    const listOfFiles = [];
    for (const fileName of fileNames) {
      const ext = extname(fileName);
      const fileStat = await fs.stat(join(directory, fileName));
      listOfFiles.push({
        name: fileName,
        ext: ext,
        contentLengthInBytes: fileStat.size,
      });
    }

    return { total: listOfFiles.length, files: listOfFiles };
  }
}
