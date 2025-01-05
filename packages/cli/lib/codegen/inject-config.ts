import { Project, SyntaxKind } from "ts-morph";

export const injectKeyValue = (
  filePath: string,
  registryObject: Record<string, any>
) => {
  const project = new Project({
    manipulationSettings: {
      useTrailingCommas: true,
    },
  });
  const sourceFile = project.addSourceFileAtPath(filePath);

  const returnStatement = sourceFile.getFirstDescendantByKind(
    SyntaxKind.ReturnStatement
  );
  let objects = returnStatement?.getFirstDescendantByKind(
    SyntaxKind.ObjectLiteralExpression
  );

  console.log(registryObject);
  const { namespace, dependencies, key: pathArray, value } = registryObject;

  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    const property = objects?.getProperty(key);

    if (property) {
      objects = property.getFirstChildByKind(
        SyntaxKind.ObjectLiteralExpression
      );
    }
  }

  if (objects) {
    console.log(JSON.stringify(value));
    objects.addPropertyAssignment({
      name: pathArray[pathArray.length - 1],
      initializer: JSON.stringify(value),
    });

    const updatedText = objects.getText().replace(/,\s*,/g, ",");
    objects.replaceWithText(updatedText);
  }

  sourceFile.formatText();
  sourceFile.saveSync();
};
