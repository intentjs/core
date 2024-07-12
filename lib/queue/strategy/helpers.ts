import Ajv, { DefinedError } from "ajv";

const ajv = new Ajv();
export function validateSchema(inputs: Record<string, any>, schema: any): void {
  const validate = ajv.compile(schema);
  if (!validate(inputs)) {
    const messages: string = (validate.errors as DefinedError[])
      .map((v) => v.message)
      .join(" \n ");
    throw new Error(messages);
  }
}
