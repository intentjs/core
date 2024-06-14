export class Package {
  static load(pkgName: string): any {
    try {
      return require(pkgName);
    } catch (e) {
      console.error(
        ` ${pkgName} is missing. Please make sure that you have installed the package first `,
      );
      process.exitCode = 1;
      process.exit();
    }
  }
}
