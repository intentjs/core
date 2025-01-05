import { cd, exec } from "shelljs";

export const runCommandInsideProject = (dirName: string, command: string) => {
  cd(dirName);
  exec(command);
};
