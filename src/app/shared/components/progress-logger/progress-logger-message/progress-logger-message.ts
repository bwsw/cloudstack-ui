export enum ProgressLoggerMessageStatus {
  InProgress,
  Done
}

export interface ProgressLoggerMessage {
  text: string;
  status?: ProgressLoggerMessageStatus;
}
