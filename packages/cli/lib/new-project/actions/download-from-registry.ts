export class DownloadFromRegistry {
  async handle(registryUrl: string) {
    /**
     * Write code to download
     */

    console.log(registryUrl);
    const str = `{
  "type": "inject-config",
  "dependencies": {
    "@aws-sdk/client-s3": "*"
  },
    "namespace": "queue",
    "key": ["connections", "sqs"],
    "value": {
      "driver": "sqs",
      "listenerType": "poll",
      "apiVersion": "2012-11-05",
      "credentials": null,
      "prefix": "env://SQS_PREFIX",
      "queue": "env://SQS_QUEUE",
      "suffix": "",
      "region": "env://AWS_REGION"
    }
}
`;

    return JSON.parse(str);
  }
}
