// /* eslint-disable sonarjs/no-duplicate-string */
// import { DefaultAzureCredential } from '@azure/identity';
// import {
//   BlobSASPermissions,
//   BlobServiceClient,
//   ContainerClient,
//   SASProtocol,
//   StorageSharedKeyCredential,
//   generateBlobSASQueryParameters,
// } from '@azure/storage-blob';
// import axios from 'axios';
// import {
//   StorageDriver,
//   DiskOptions,
//   FileOptions,
//   StorageDriver$PutFileResponse,
//   StorageDriver$FileMetadataResponse,
//   StorageDriver$RenameFileResponse,
// } from '../interfaces';

// export class AzureBlobDriver implements StorageDriver {
//   private readonly disk: string;
//   private config: DiskOptions;
//   private blobClient: BlobServiceClient;
//   private containerClient: ContainerClient;

//   constructor(disk: string, config: DiskOptions) {
//     this.disk = disk;
//     this.config = config;

//     if (config.passwordLess) {
//       const url =
//         config.url || `https://${config.accountName}.blob.core.windows.net`;
//       this.blobClient = new BlobServiceClient(
//         url,
//         new DefaultAzureCredential(),
//       );
//     } else if (config.accountKey) {
//       const sharedCredential = new StorageSharedKeyCredential(
//         config.accountName,
//         config.accountKey,
//       );
//       const url =
//         config.url || `https://${config.accountName}.blob.core.windows.net`;

//       this.blobClient = new BlobServiceClient(url, sharedCredential);
//     } else if (config.connectionString) {
//       this.blobClient = BlobServiceClient.fromConnectionString(
//         config.connectionString,
//       );
//     }

//     this.containerClient = this.blobClient.getContainerClient(
//       config.containerName,
//     );
//   }

//   put(
//     path: string,
//     fileContent: any,
//     options?: FileOptions,
//   ): Promise<StorageDriver$PutFileResponse> {
//     console.log(path, fileContent, options);
//     throw new Error('Method not implemented.');
//   }

//   async get(path: string): Promise<Buffer> {
//     const filePath = this.signedUrl(path, 60);
//     const response = await axios.get(filePath, {
//       responseType: 'arraybuffer',
//     });
//     return response.data;
//   }

//   exists(path: string): Promise<boolean> {
//     console.log(path);
//     throw new Error('Method not implemented.');
//   }

//   missing(path: string): Promise<boolean> {
//     console.log(path);
//     throw new Error('Method not implemented.');
//   }

//   url(path: string): string {
//     console.log(path);
//     throw new Error('Method not implemented.');
//   }

//   signedUrl(path: string, expireInMinutes: number): string {
//     const EXPIRY = (expireInMinutes || 30) * 60 * 1000;
//     const NOW = new Date();
//     const START_TIME = new Date(NOW.valueOf() - EXPIRY);
//     const EXPIRY_TIME = new Date(NOW.valueOf() + EXPIRY);

//     const params = generateBlobSASQueryParameters(
//       {
//         containerName: this.containerClient.containerName,
//         blobName: path,
//         permissions: BlobSASPermissions.parse('r'),
//         protocol: SASProtocol.HttpsAndHttp,
//         startsOn: START_TIME,
//         expiresOn: EXPIRY_TIME,
//       },
//       new StorageSharedKeyCredential(
//         this.config.accountName || '',
//         this.config.accountKey || '',
//       ),
//     ).toString();

//     const blobBlockClient = this.containerClient.getBlobClient(path);

//     return `${blobBlockClient.url}?${params}`;
//   }

//   meta(path: string): Promise<StorageDriver$FileMetadataResponse> {
//     console.log(path);
//     throw new Error('Method not implemented.');
//   }

//   delete(path: string): Promise<boolean> {
//     console.log(path);
//     throw new Error('Method not implemented.');
//   }

//   copy(
//     path: string,
//     newPath: string,
//   ): Promise<StorageDriver$RenameFileResponse> {
//     console.log(path, newPath);
//     throw new Error('Method not implemented.');
//   }

//   move(
//     path: string,
//     newPath: string,
//   ): Promise<StorageDriver$RenameFileResponse> {
//     console.log(path, newPath);
//     throw new Error('Method not implemented.');
//   }

//   getContainerAndPath(path: string): Record<string, any> {
//     const [container, ...subpaths] = path.split('/');
//     return { container, path: subpaths.join('/') };
//   }

//   getClient() {
//     return this.containerClient;
//   }

//   getConfig(): Record<string, any> {
//     return this.config;
//   }

//   listDir(path: string): Promise<Record<string, any>> {
//     throw new Error('Method not implemented.');
//   }
// }
