import { ReadStream } from 'fs';
import { GenericFunction } from '../../interfaces';
import { Package } from '../../utils';
import { Str } from '../../utils/string';
import { CannotParseAsJsonException } from '../exceptions/cannotParseAsJson';
import { CannotPerformFileOpException } from '../exceptions/cannotPerformFileOp';
import { getMimeFromExtension } from '../helpers';
import {
  StorageDriver,
  FileOptions,
  StorageDriver$FileMetadataResponse,
  StorageDriver$PutFileResponse,
  StorageDriver$RenameFileResponse,
  S3DiskOptions,
} from '../interfaces';
import { StorageService } from '../service';

export class S3Storage implements StorageDriver {
  private readonly disk: string;
  private config: S3DiskOptions;
  private client: any;
  private AWS: any;
  private getSignedUrlFn: GenericFunction;

  constructor(disk: string, config: S3DiskOptions) {
    this.disk = disk;
    this.config = config;
    const { getSignedUrl } = Package.load('@aws-sdk/s3-request-presigner');
    this.getSignedUrlFn = getSignedUrl;
    this.AWS = Package.load('@aws-sdk/client-s3');
    this.client = new this.AWS.S3({
      region: this.config.region,
      credentials: config.credentials || {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
    });
  }

  getStream(filePath: string): ReadStream {
    console.log('file path ===> ', filePath);
    throw new Error('Method not implemented.');
  }

  listDir(path: string): Promise<Record<string, any>> {
    console.log(path);
    throw new Error('Method not implemented.');
  }

  /**
   * Put file content to the path specified.
   *
   * @param path
   * @param fileContent
   */
  async put(
    path: string,
    fileContent: any,
    options?: FileOptions,
  ): Promise<StorageDriver$PutFileResponse> {
    const { mimeType } = options || {};
    const params = {
      Bucket: this.config.bucket,
      Key: this.getPath(path),
      Body: fileContent,
      ContentType: mimeType ? mimeType : getMimeFromExtension(path),
      ...(options?.s3Meta || {}),
    };
    await this.client.putObject(params);
    return {
      url: await this.url(this.getPath(path)),
      path: this.getPath(path),
    };
  }

  /**
   * Get Signed Urls for certain actions
   * @param path
   */
  async signedUrl(
    path: string,
    expireInMinutes = 20,
    command: 'get' | 'put' = 'get',
  ): Promise<string> {
    const commandMap = {
      get: this.AWS.GetObjectCommand,
      put: this.AWS.PutObjectCommand,
    };

    const commandObj = new commandMap[command]({
      Bucket: this.config.bucket,
      Key: this.getPath(path),
    });
    return await this.getSignedUrlFn(this.client, commandObj, {
      expiresIn: 60 * expireInMinutes,
    });
  }

  /**
   * Get file stored at the specified path.
   *
   * @param path
   */
  async get(path: string): Promise<Buffer | null> {
    try {
      const command = new this.AWS.GetObjectCommand({
        Bucket: this.config.bucket,
        Key: this.getPath(path),
      });

      const res = await this.client.send(command);
      return Buffer.from(await res.Body.transformToByteArray());
    } catch (e) {
      return null;
    }
  }

  /**
   * Get object's metadata
   * @param path
   */
  async meta(path: string): Promise<StorageDriver$FileMetadataResponse> {
    try {
      const command = new this.AWS.HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: this.getPath(path),
      });
      const res = await this.client.send(command);
      return {
        path: this.getPath(path),
        contentType: res.ContentType,
        contentLength: res.ContentLength,
        lastModified: res.LastModified,
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if file exists at the path.
   *
   * @param path
   */
  async exists(path: string): Promise<boolean> {
    const meta = await this.meta(this.getPath(path));
    return !!Object.keys(meta || {}).length;
  }

  /**
   * Check if file is missing at the path.
   *
   * @param path
   */
  async missing(path: string): Promise<boolean> {
    const meta = await this.meta(this.getPath(path));
    return !!Object.keys(meta || {}).length;
  }

  /**
   * Get URL for path mentioned.
   *
   * @param path
   */
  async url(path: string): Promise<string> {
    const signedUrl = await this.signedUrl(path, 20, 'get');
    return Str.before(signedUrl, '?');
  }

  /**
   * Delete file at the given path.
   *
   * @param path
   */
  async delete(filePath: string): Promise<boolean> {
    const params = {
      Bucket: this.config.bucket || '',
      Key: this.getPath(filePath),
    };

    try {
      await this.client.deleteObject(params);
      return true;
    } catch (err) {
      if (this.shouldThrowError()) {
        throw new CannotPerformFileOpException(
          `File ${filePath} cannot be deleted due to the reason: ${err['message']}`,
        );
      }
      return false;
    }
  }

  /**
   * Copy file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  async copy(
    sourcePath: string,
    destinationPath: string,
  ): Promise<StorageDriver$RenameFileResponse> {
    const copyCommand = new this.AWS.CopyObjectCommand({
      Bucket: this.config.bucket || '',
      CopySource: '/' + this.config.bucket + '/' + this.getPath(sourcePath),
      Key: destinationPath,
    });

    await this.client.send(copyCommand);
    return { path: destinationPath, url: await this.url(destinationPath) };
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
    await this.copy(this.getPath(path), newPath);
    await this.delete(this.getPath(path));
    return { path: newPath, url: await this.url(newPath) };
  }

  async copyToDisk(
    sourcePath: string,
    destinationDisk: string,
    destinationPath: string,
  ): Promise<boolean> {
    try {
      const buffer = await this.get(sourcePath);
      const driver = StorageService.getDriver(destinationDisk);
      await driver.put(destinationPath, buffer);
      return true;
    } catch (e) {
      if (this.shouldThrowError()) {
        throw new CannotPerformFileOpException(
          `File cannot be copied from ${sourcePath} to ${destinationDisk} in ${destinationDisk} disk for the reason: ${e['message']}`,
        );
      }
    }

    return false;
  }

  async moveToDisk(
    sourcePath: string,
    destinationDisk: string,
    destinationPath: string,
  ): Promise<boolean> {
    try {
      const buffer = await this.get(sourcePath);
      const driver = StorageService.getDriver(destinationDisk);
      await driver.put(destinationPath, buffer);
      await this.delete(sourcePath);
      return true;
    } catch (e) {
      if (this.shouldThrowError()) {
        throw new CannotPerformFileOpException(
          `File cannot be moved from ${sourcePath} to ${destinationDisk} in ${destinationDisk} disk for the reason: ${e['message']}`,
        );
      }
    }
    return false;
  }

  async getAsJson(
    path: string,
    throwError = false,
  ): Promise<Record<string, any>> {
    const buffer = await this.get(path);
    try {
      return JSON.parse(buffer.toString());
    } catch (e) {
      if (throwError) {
        throw new CannotParseAsJsonException();
      }
      return null;
    }
  }

  temporaryUrl(
    path: string,
    ttlInMins: number,
    params?: Record<string, any>,
  ): Promise<string> {
    console.log(path, ttlInMins, params);
    throw new Error('Method not implemented.');
  }

  async size(path: string): Promise<number> {
    const meta = await this.meta(path);
    return meta.contentLength;
  }

  async lastModifiedAt(path: string): Promise<Date> {
    const meta = await this.meta(path);
    return meta.lastModified;
  }

  async mimeType(path: string): Promise<string> {
    const meta = await this.meta(path);
    return meta.contentType;
  }

  async path(path: string): Promise<string> {
    console.log(path);
    return this.getPath(path);
  }

  /**
   * Get instance of driver's client.
   */
  getClient<T = any>(): T {
    return this.client as any;
  }

  /**
   * Get config of the driver's instance.
   */
  getConfig(): Record<string, any> {
    return this.config;
  }

  /**
   * Get path of the driver's instance.
   */
  getPath(path: string): string {
    return this.config.basePath ? `${this.config.basePath}/${path}` : path;
  }

  shouldThrowError(): boolean {
    return this.config.throwOnFailure === undefined
      ? true
      : this.config.throwOnFailure;
  }
}
