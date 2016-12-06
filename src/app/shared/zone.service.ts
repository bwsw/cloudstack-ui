import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiRequestBuilderService, NotificationService } from '.';

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
    private notification: NotificationService
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
        this.notification.message('You are not logged in');
        break;

      case 431:
        this.notification.message('Wrong arguments');
        break;
    }
  }
}
