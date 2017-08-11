import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

interface ErrorTranslation {
  regex: RegExp;
  translation: string;
}

@Injectable()
export class ErrorService extends Subject<any> {
  private static ErrorMap: Array<ErrorTranslation> = [
    {
      regex: /Going from existing size of.*/,
      translation: 'VOLUME_NEWSIZE_LOWER'
    },
    {
      regex: /Maximum number of resources of type \'primary_storage\'.*/,
      translation: 'VOLUME_PRIMARY_STORAGE_EXCEEDED'
    },
    {
      regex: /The vm with hostName (.*) already exists.*/,
      translation: 'THE_NAME_IS_TAKEN'
    },
    {
      regex: /A key pair with name '(.*)' already exists/,
      translation: 'KEYPAIR_ALREADY_EXISTS'
    },
    {
      regex: /Unable to find suitable primary storage when creating volume (.*)/,
      translation: 'UNABLE_FIND_PRIMARY_STORAGE'
    },
    {
      regex: /There is other active snapshot tasks on the instance (.*)/,
      translation: 'VOLUME_BUSY'
    },
    {
      regex: /User is not allowed CloudStack login/,
      translation: 'LOGIN_FORM.INCORRECT_USERNAME'
    },
    {
      regex: /Failed to authenticate user (.*); please provide valid credentials/,
      translation: 'LOGIN_FORM.INCORRECT_PASSWORD'
    },
    {
      regex: /Unable to find the domain from the path \/(.*)\//,
      translation: 'LOGIN_FORM.INCORRECT_DOMAIN'
    },
    {
      regex: /Value greater than max allowed length (\d+) for param: volumeName/,
      translation: 'VOLUME_NAME_TOO_LONG'
    }
  ];

  public static parseError(error: any): any {
    const err = ErrorService.ErrorMap.find(_ => _.regex.test(error.errortext));
    if (!err) {
      error.message = error.errortext;
    } else {
      error.message = err.translation;

      const matches = err.regex.exec(error.errortext);
      matches.shift();
      error.params = matches.reduce((map, val, index) => {
        map[`val${index + 1}`] = val;
        return map;
      }, {});
    }

    return error;
  }

  // Get Cloudstack error code from response
  public parseCsError(response: any): number {
    // get response object keys. we need this because response types may differ (e.g. startvirtualmachineresponse)
    const r = Object.keys(JSON.parse(response._body));
    // return Cloudstack error code
    if (r.length && response[r[0]].errorcode) {
      return response[r[0]].cserrorcode;
    }
    return 0;
  }

  public send(error: any): void {
    this.next(error);
  }
}
