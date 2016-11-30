import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApiRequestBuilderService } from '../shared/api-request-builder.service';
import 'rxjs/add/operator/toPromise';

interface RootDiskLimitResponse {
  listresourcelimitsresponse: {
    resourcelimit: [{
      max: string
    }]
  };
}

interface VolumeSizeResponse {
  listvolumesresponse: {
    volume: Array<Volume>
  };
}

interface Volume {
  type: string;
  size: string;
}

@Injectable()
export class RootDiskSizeService {

  constructor(private requestBuilder: ApiRequestBuilderService, private http: Http) {}

  public getAvailableRootDiskSize(): Promise<number> {
    let limitRequest = this.requestBuilder.buildGETRequest({
      'command': 'listResourceLimits',
      'resourcetype': '10',
      'response': 'json'
    });

    let volumeRequest = this.requestBuilder.buildGETRequest({
      'command': 'listVolumes',
      'response': 'json'
    });

    let p1 = this.http.get(limitRequest)
      .toPromise()
      .then(response => +response.json().listresourcelimitsresponse.resourcelimit[0].max);

    let p2 = this.http.get(volumeRequest)
      .toPromise()
      .then(response => response.json().listvolumesresponse.volume.reduce(
        (accum: number, current: Volume, index: number, arr: Array<Volume>) => {
          return accum + +current.size;
        }, 0));

    return Promise.all([p1, p2])
      .then(values => {
        let space = values[0] * Math.pow(2, 30) - values[1];
        return space > 0 ? Math.floor(space / Math.pow(2, 30)) : 0;
      })
      .catch(this.handleError);
  }

  private handleError(e): Promise<void> {
    return Promise.reject(e);
  }
}
