import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

const apiUrl = '/client/api';

@Injectable()
export class ApiRequestBuilderService {

  private buildRequest(requestParams: {}): string {
    let urlParams = new URLSearchParams();
    for (let key in requestParams) {
      if (requestParams.hasOwnProperty(key)) {
        urlParams.append(key, requestParams[key]);
      }
    }
    return urlParams.toString();
  }

  public buildGETRequest(requestParams: {}): string {
    return apiUrl + '?' + this.buildRequest(requestParams);
  }

  public buildPOSTRequest(requestParams: {}): string {
    return this.buildRequest(requestParams);
  }
}
