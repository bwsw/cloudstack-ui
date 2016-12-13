import { Injectable } from '@angular/core';

import { BaseBackendService } from '.';
import { BackendResource } from '../decorators';
import { OsType } from '../models/os-type.model';


@Injectable()
@BackendResource({
  entity: 'OsType',
  entityModel: OsType
})
export class OsTypeService extends BaseBackendService<OsType> { }
