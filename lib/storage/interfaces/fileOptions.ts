import { PutObjectRequest } from 'aws-sdk/clients/s3';

export interface FileOptions {
  mimeType?: string;
  s3Meta?: PutObjectRequest;
}
