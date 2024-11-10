import { HttpKernel } from './http/kernel';
import { ApplicationContainer } from './boot/container';
import { ApplicationExceptionFilter } from './errors/filter';
import { IntentHttpServer } from '@intentjs/core';
import heapdump from 'heapdump';

// Create a heapdump on demand
const createHeapdump = () => {
  const filename = `heapdump-${Date.now()}.heapsnapshot`;
  heapdump.writeSnapshot(filename, (err, filename) => {
    if (err) {
      console.error('Error creating heapdump:', err);
    } else {
      console.log(`Heapdump written to ${filename}`);
    }
  });
};

IntentHttpServer.init()
  .useContainer(ApplicationContainer)
  .useKernel(HttpKernel)
  .handleErrorsWith(ApplicationExceptionFilter)
  .start();
