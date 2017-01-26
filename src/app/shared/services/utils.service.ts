import { Injectable } from '@angular/core';
import * as uuid from 'uuid';


@Injectable()
export class UtilsService {
  public getUniqueId(): string {
    return uuid.v4();
  }
}
