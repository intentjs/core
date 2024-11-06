import { join } from 'path';
import { path } from 'app-root-path';
import { Project } from 'ts-morph';

export const getClassNamesFromFilePath = (filePath: string): string[] => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(join(path, filePath));
  const classes = sourceFile.getClasses();
  return classes.map(c => c.getName());
};
