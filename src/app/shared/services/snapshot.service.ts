import { Injectable } from '@angular/core';
import { Snapshot } from '../models/snapshot.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


@Injectable()
@BackendResource({
  entity: 'Snapshot',
  entityModel: Snapshot
})
export class SnapshotService extends BaseBackendService<Snapshot> { }

