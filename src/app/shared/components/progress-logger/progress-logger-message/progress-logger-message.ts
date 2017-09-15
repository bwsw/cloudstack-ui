export enum ProgressLoggerMessageStatus {
  Highlighted,
  InProgress,
  Done,
  Error,
  ErrorMessage
}

export interface ProgressLoggerMessageData {
  text: string;
  status?: Array<ProgressLoggerMessageStatus>;
}

export interface ProgressLoggerMessage {
  id: string;
  text: string;
  status?: Array<ProgressLoggerMessageStatus>;
}
