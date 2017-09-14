export enum ProgressLoggerMessageStatus {
  Highlighted,
  InProgress,
  Done,
  Error
}

export interface ProgressLoggerMessage {
  text: string;
  status?: ProgressLoggerMessageStatus | Array<ProgressLoggerMessageStatus>;
}
