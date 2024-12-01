import { Readable } from 'stream';
import { types } from 'util';

export type StreamableFileOptions = {
  /**
   * The value that will be used for the `Content-Type` response header.
   */
  type?: string;

  /**
   * The value that will be used for the `Content-Disposition` response header.
   */
  disposition?: string;

  /**
   * The value that will be used for the `Content-Length` response header.
   */
  length?: number;
};

export class StreamableFile {
  private readonly stream: Readable;

  constructor(buffer: Uint8Array, options?: StreamableFileOptions);
  constructor(readable: Readable, options?: StreamableFileOptions);
  constructor(
    bufferOrReadable: Uint8Array | Readable,
    readonly options: StreamableFileOptions = {},
  ) {
    if (types.isUint8Array(bufferOrReadable)) {
      this.stream = new Readable();
      this.stream.push(bufferOrReadable);
      this.stream.push(null);
      this.options.length ??= bufferOrReadable.length;
    } else if (bufferOrReadable.pipe) {
      this.stream = bufferOrReadable;
    }
  }

  getStream(): Readable {
    return this.stream;
  }

  getHeaders() {
    const {
      type = 'application/octet-stream',
      disposition = undefined,
      length = undefined,
    } = this.options;

    return {
      type,
      disposition,
      length,
    };
  }
}
