const os = require('os');
const path = require('path');
const UploadedFile = require('./uploaded-file');

async function process_multipart_data(req) {
    const fields = {};
    const tempDirectory = os.tmpdir();
    const generateTempFilename = (filename) => `${Date.now()}-${filename}`;
    const advancedPattern = /(\w+)(\[\d*\])+/;

    await req.multipart(async (field) => {
        const isArray = field.name.match(advancedPattern);
        const strippedFieldName = isArray?.length ? isArray[1] : field.name;
        const existingFieldValue = fields[strippedFieldName];

        if (Array.isArray(isArray) && !existingFieldValue) {
            fields[strippedFieldName] = [];
        }

        if (field.file) {
            const tempFileName = generateTempFilename(field.file.name);
            const tempFilePath = path.join(tempDirectory, tempFileName);
            let fileSize = 0;

            field.file.stream.on('data', (chunk) => {
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

            const existingFieldValue = fields[strippedFieldName];
            if (Array.isArray(existingFieldValue)) {
                fields[strippedFieldName] = existingFieldValue.concat(uploadedFile);
            } else {
                fields[strippedFieldName] = uploadedFile;
            }
        } else {
            const existingFieldValue = fields[strippedFieldName];
            if (Array.isArray(existingFieldValue)) {
                fields[strippedFieldName] = existingFieldValue.concat(field.value);
            } else {
                fields[strippedFieldName] = field.value;
            }
        }
    });

    return fields;
}

module.exports = {
    process_multipart_data,
};
