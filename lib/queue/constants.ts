export const JOB_NAME = '__JOB_NAME__';
export const JOB_OPTIONS = '__JOB_OPTIONS__';

export const events = {
  jobFailed: 'intent-queue::job-failed',
  jobProcessing: 'intent-queue::job-processing',
  jobProcessed: 'intent-queue::job-processed',
  jobMaxRetriesExceeed: 'intent-queue::job-max-retries-exceeded',
};

export enum JobStatusEnum {
  success,
  retry,
  jobNotFound,
}
