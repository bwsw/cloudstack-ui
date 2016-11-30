import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertService, ApiRequestBuilderService } from '.';

import 'rxjs/add/operator/toPromise';

export interface Zone {
  id: string;
  name: string;
}

@Injectable()
export class ZoneService {
  constructor(
    private http: Http,
    private requestBuilder: ApiRequestBuilderService,
    private alert: AlertService
  ) { }

  public getZoneList(available = true): Promise<Array<Zone>> {
    let params: any = {
      command: 'listZones',
      response: 'json'
    };

    if (available) {
      params.available = true;
    }

    let request = this.requestBuilder.buildGETRequest(params);

    return this.http.get(request)
      .toPromise()
      .then(response => response.json())
      .then(
        response => response.listzonesresponse.zone,
        error => {
          if (error.status === 401) {
            this.alert.alert('You are not logged in');
          }
         }
      );
  }
}
