import * as pc from 'picocolors';
import { InternalLogger } from './logger';

export class Package {
  static load(pkgName: string): any {
    try {
      return require(pkgName);
    } catch (e) {
      InternalLogger.error(
        'PackageLoader',
        `${pc.underline(
          pkgName,
        )} is missing. Please make sure that you have installed the package first`,
      );
      process.exit();
      // process.exitCode = 1;
      // process.exit();
    }
  }
}
