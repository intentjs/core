import AWS = require('aws-sdk');
import { Credentials } from 'aws-sdk';
import { SqsJob } from '../interfaces/sqsJob';
import { InternalMessage, QueueDriver } from '../strategy';

export class SqsQueueDriver implements QueueDriver {
  private client: AWS.SQS;
  private queueUrl: string;

  constructor(private options: Record<string, any>) {
    AWS.config.update({ region: options.region });

    if (options.profile) {
      options['credentials'] = new AWS.SharedIniFileCredentials({
        profile: options.profile,
      });
    } else if (options.accessKey && options.secretKey) {
      options['credentials'] = new Credentials({
        accessKeyId: options.accessKey,
        secretAccessKey: options.secretKey,
      });
    }

    this.client = new AWS.SQS({
      apiVersion: options.apiVersion,
      credentials: options.credentials,
    });
    this.queueUrl = options.prefix + '/' + options.queue;
  }

  async push(message: string, rawPayload: InternalMessage): Promise<void> {
    const params = {
      DelaySeconds: rawPayload.delay,
      MessageBody: message,
      QueueUrl: this.options.prefix + '/' + rawPayload.queue,
    };

    await this.client.sendMessage(params).promise().then();
    return;
  }

  async pull(options: Record<string, any>): Promise<SqsJob | null> {
    const params = {
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ['All'],
      QueueUrl: this.options.prefix + '/' + options.queue,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 20,
    };
    const response = await this.client.receiveMessage(params).promise();
    const message = response.Messages ? response.Messages[0] : null;
    return message ? new SqsJob(message) : null;
  }

  async remove(job: SqsJob, options: Record<string, any>): Promise<void> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
      ReceiptHandle: job.data.ReceiptHandle,
    };

    await this.client.deleteMessage(params).promise();

    return;
  }

  async purge(options: Record<string, any>): Promise<void> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
    };

    await this.client.purgeQueue(params).promise();

    return;
  }

  async count(options: Record<string, any>): Promise<number> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
      AttributeNames: ['ApproximateNumberOfMessages'],
    };
    const response: Record<string, any> = await this.client
      .getQueueAttributes(params)
      .promise();
    return +response.Attributes.ApproximateNumberOfMessages;
  }
}
