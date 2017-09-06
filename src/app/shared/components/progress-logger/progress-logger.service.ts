import { ProgressLoggerMessage } from './progress-logger-message';


export class ProgressLoggerController {
  private _messages: Array<ProgressLoggerMessage> = [];

  public get messages(): Array<ProgressLoggerMessage> {
    return this._messages;
  }

  public getLastMessages(number: number): Array<ProgressLoggerMessage> {
    const startIndex = Math.max(0, this.messages.length - number);

    return this.messages.slice(startIndex);
  }

  public addMessage(message: ProgressLoggerMessage): void {
    this._messages.push(message);
  }
}
