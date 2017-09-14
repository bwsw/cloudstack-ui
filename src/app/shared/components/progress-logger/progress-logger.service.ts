import { ProgressLoggerMessage, ProgressLoggerMessageStatus } from './progress-logger-message/progress-logger-message';


export class ProgressLoggerController {
  private _messages: Array<ProgressLoggerMessage> = [];

  public get messages(): Array<ProgressLoggerMessage> {
    return this._messages;
  }

  public addMessage(message: ProgressLoggerMessage): void {
    this._messages.push(message);
  }

  public updateLastMessageStatus(newStatus: ProgressLoggerMessageStatus): void {
    if (this._messages.length - 1 >= 0) {
      this._messages[this._messages.length - 1].status = newStatus;
    }
  }
}
