import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

interface ErrorTranslation {
  regex: string;
  translation: string;
}

@Injectable()
export class ErrorService extends Subject<any> {
  private static ErrorMap: Array<ErrorTranslation> = [
    {
      regex: 'Going from existing size of.*',
      translation: 'VOLUME_NEWSIZE_LOWER'
    },
    {
      regex: 'Maximum number of resources of type \'primary_storage\'.*',
      translation: 'VOLUME_PRIMARY_STORAGE_EXCEEDED'
    },
    {
      regex: 'The vm with hostName (.*) already exists.*',
      translation: 'THE_NAME_IS_TAKEN'
    }
  ];

  // Get Cloudstack error code from response
  public parseCsError(response: any): number {
    // get response object keys. we need this because response types may differ (e.g. startvirtualmachineresponse)
    let r = Object.keys(JSON.parse(response._body));
    // return Cloudstack error code
    if (r.length && response[r[0]].errorcode) {
      return response[r[0]].cserrorcode;
    }
    return 0;
  }

  public send(error: any): void {
    this.next(error);
  }

  public static parseError(error: any): any {
    const err = ErrorService.ErrorMap.find(_ => new RegExp(_.regex).test(error.errortext));
    if (!err) {
      error.message = error.errortext;
    } else {
      error.message = err.translation;

      const params = (new RegExp(err.regex)).exec(error.errortext);
      params.shift();
      const translationParams = {};
      params.forEach((val, index) => translationParams[`val${index + 1}`] = val);
      error.params = translationParams;
    }

    return error;
  }
}
