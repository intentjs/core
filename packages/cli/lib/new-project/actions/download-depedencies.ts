import { exec, execSync } from "child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);
export const downloadDependenciesUsingNpm = async (dirName: string) => {
  await execAsync(`npm install`, {
    windowsHide: true,
    cwd: dirName,
  });
};

export const downloadPackageUsingNpm = async (
  dirName: string,
  dependencies: string[]
) => {
  await execAsync(`npm install ${dependencies.join(" ")} --save`, {
    windowsHide: true,
    cwd: dirName,
  });
};
