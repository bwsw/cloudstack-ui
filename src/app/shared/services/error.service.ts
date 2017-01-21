import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ErrorService extends Subject<any> {
  public parseCsError(response: any): number {
    let r = Object.keys(JSON.parse(response._body));
    if (r.length) {
      return response[r[0]].cserrorcode;
    }
    return 0;
  }
}
