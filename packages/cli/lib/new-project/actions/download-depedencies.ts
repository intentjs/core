import { execSync } from "child_process";

export const downloadDependenciesUsingNpm = async (dirName: string) => {
  execSync(`cd ${dirName}`);
  execSync(`npm i`, { stdio: "ignore" });
  execSync("cd ..");
};
