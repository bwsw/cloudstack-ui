import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
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

  public get(id: string): Promise<Zone> {
    let params: any = this.getDefaultParams();

    params.id = id;

    let request = this.requestBuilder.buildGETRequest(params);

    return this.http.get(request)
      .toPromise()
      .then(response => response.json().listzonesresponse.zone[0] as Zone)
      .catch(error => this.handleError(error));
  }

  public getList(available = true): Promise<Array<Zone>> {
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
      .then(response => response.json().listzonesresponse.zone as Array<Zone>)
      .catch(error => this.handleError(error));
  }

  private getDefaultParams(): any {
    return {
      command: 'listZones',
      response: 'json'
    };
  }

  private handleError(error: Response): void {
    switch (error.status) {
      case 401:
        this.alert.alert('You are not logged in');
        break;

      case 431:
        this.alert.alert('Wrong arguments');
        break;
    }
  }
}
