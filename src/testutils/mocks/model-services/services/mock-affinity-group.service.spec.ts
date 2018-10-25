import { Injectable } from '@angular/core';
import { AffinityGroup } from '../../../../app/shared/models';
import { Observable, of } from 'rxjs';

const affinityGroups: AffinityGroup[] = require('../fixtures/affinityGroups.json');

@Injectable()
export class MockAffinityGroupService {
  public getList(): Observable<AffinityGroup[]> {
    return of(affinityGroups);
  }
}
