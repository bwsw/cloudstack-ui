import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NotificationService } from '../notification.service';

import 'rxjs/add/operator/toPromise';

import { Volume } from '../models/volume.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


@Injectable()
@BackendResource({
  entity: 'Volume',
  entityModel: Volume
})
export class VolumeService extends BaseBackendService<Volume> {
  constructor(http: Http, notification: NotificationService) {
    super(http, notification);
  }
}

