import { Utils } from '../../services/utils/utils.service';
import {
  ProgressLoggerMessage,
  ProgressLoggerMessageData,
} from './progress-logger-message/progress-logger-message';

export class ProgressLoggerController {
  // tslint:disable-next-line:variable-name
  private _messages: ProgressLoggerMessage[] = [];

  public get messages(): ProgressLoggerMessage[] {
    return this._messages;
  }

  public addMessage(message: ProgressLoggerMessageData): string {
    const messageWithId = this.getMessageWithId(message);
    this._messages.push(messageWithId);
    return messageWithId.id;
  }

  public updateMessage(id: string, data: Partial<ProgressLoggerMessageData>): void {
    this._messages = this._messages.map(message => {
      if (message.id != null && message.id === id) {
        return { ...message, ...data };
      }
      return message;
    });
  }

  private getMessageWithId(message: ProgressLoggerMessageData): ProgressLoggerMessage {
    const id = Utils.getUniqueId();
    return { ...message, id };
  }
}
