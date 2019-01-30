import { Injectable } from '@angular/core';
import { ApiLoggerMessage } from '../components/progress-logger/progress-logger-message/progress-logger-message';
import { Utils } from './utils/utils.service';

export enum ApiLoggerStage {
  CREATE_TAGS = 'createTags',
  DEPLOY_VM = 'deployVirtualMachine',
}

@Injectable()
export class ApiLogService {
  private apiLogMessages: ApiLoggerMessage[] = [];

  constructor() {}

  public add(message: ApiLoggerMessage): string {
    const id = Utils.getUniqueId();
    message.id = id;
    this.apiLogMessages.push(message);
    return message.id;
  }

  public update(id: string, response: any): void {
    const ind = this.apiLogMessages.findIndex(m => m.id === id);
    Object.assign(this.apiLogMessages[ind], { response });
  }

  public get apiLog(): ApiLoggerMessage[] {
    return this.apiLogMessages;
  }

  public resetLog(): void {
    this.apiLogMessages = [];
  }
}
