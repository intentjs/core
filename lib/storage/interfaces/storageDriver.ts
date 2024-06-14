import { ReadStream } from 'fs';
import {
  StorageDriver$GetFileResponse,
  StorageDriver$FileMetadataResponse,
  StorageDriver$PutFileResponse,
  StorageDriver$RenameFileResponse,
  FileOptions,
} from '.';

export interface StorageDriver {
  /**
   * Put file content to the path specified.
   *
   * @param path
   * @param fileContent
   */
  put(
    path: string,
    fileContent: any,
    options?: FileOptions,
  ): Promise<StorageDriver$PutFileResponse>;

  /**
   * Get file stored at the specified path.
   *
   * @param path
   */
  get(path: string): Promise<StorageDriver$GetFileResponse>;

  getStream(filePath: string): ReadStream;

  /**
   * Check if file exists at the path.
   *
   * @param path
   */
  exists(path: string): Promise<boolean>;

  /**
   * Check if file is missing at the path.
   *
   * @param path
   */
  missing(path: string): Promise<boolean>;

  /**
   * Get URL for path mentioned.
   *
   * @param path
   */
  url(path: string): string;

  /**
   * Get Signed Urls
   * @param path
   * @param expireInMinutes
   */
  signedUrl(path: string, expireInMinutes: number): string;

  /**
   * Get object's metadata
   * @param path
   */
  meta(path: string): Promise<StorageDriver$FileMetadataResponse>;

  /**
   * Delete file at the given path.
   *
   * @param path
   */
  delete(path: string): Promise<boolean>;

  /**
   * Copy file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  copy(
    path: string,
    newPath: string,
  ): Promise<StorageDriver$RenameFileResponse>;

  /**
   * Move file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  move(
    path: string,
    newPath: string,
  ): Promise<StorageDriver$RenameFileResponse>;

  listDir(path: string): Promise<Record<string, any>>;
  // /**
  //  * Copy object from one path to the same path but on a different disk
  //  *
  //  * @param filePath
  //  * @param destinationDisk
  //  * @returns
  //  */
  // copyToDisk(filePath: string, destinationDisk: string): Promise<boolean>;

  // /**
  //  * Copy object from one path to the same path but on a different disk
  //  *
  //  * @param filePath
  //  * @param destinationDisk
  //  * @returns
  //  */
  // moveToDisk(filePath: string, destinationDisk: string): Promise<boolean>;

  /**
   * Get instance of driver's client.
   */
  getClient(): any;

  /**
   * Get config of the driver's instance.
   */
  getConfig(): Record<string, any>;
}
