import { ParametrizedTranslation } from '../../../../dialog/dialog-service/dialog.service';

export enum ProgressLoggerMessageStatus {
  Highlighted,
  InProgress,
  Done,
  Error,
  ErrorMessage,
}

export interface ProgressLoggerMessageData {
  text: string;
  status?: ProgressLoggerMessageStatus[];
}

export interface ProgressLoggerMessage {
  id: string;
  text: string | ParametrizedTranslation;
  status?: ProgressLoggerMessageStatus[];
}
