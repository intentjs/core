import { Request as HyperRequest } from 'hyper-express';
import { tmpdir } from 'os';
import { join } from 'path';
import { ulid } from 'ulid';
import { UploadedFile } from '../../../storage/file-handlers/uploaded-file';
import { Str } from '../../../utils/string';

export const processMultipartData = async (
  req: HyperRequest,
): Promise<Map<string, any>> => {
  const fields = new Map<string, any>();
  const tempDirectory = tmpdir();
  const generateTempFilename = (filename: string) => `${ulid()}-${filename}`;

  try {
    await req.multipart(async field => {
      const isArray = Str.is(field.name, '*[*]');
      const strippedFieldName = Str.before(field.name, '[');
      const existingFieldValue = fields.get(strippedFieldName);

      if (isArray && !existingFieldValue) {
        fields.set(strippedFieldName, []);
      }

      if (field.file) {
        const tempFileName = generateTempFilename(field.file.name);
        const tempFilePath = join(tempDirectory, tempFileName);
        let fileSize = 0;

        field.file.stream.on('data', chunk => {
          fileSize += chunk.length;
        });

        await field.write(tempFilePath);

        const uploadedFile = new UploadedFile(
          field.file.name,
          fileSize,
          field.mime_type,
          tempFileName,
          tempFilePath,
        );

        if (Array.isArray(existingFieldValue)) {
          fields.set(
            strippedFieldName,
            existingFieldValue.concat(uploadedFile),
          );
        } else {
          fields.set(strippedFieldName, uploadedFile);
        }
      } else {
        if (Array.isArray(existingFieldValue)) {
          fields.set(strippedFieldName, existingFieldValue.concat(field.value));
        } else {
          fields.set(strippedFieldName, field.value);
        }
      }
    });
  } catch (e) {
    console.error(e);
  }

  return fields;
};
