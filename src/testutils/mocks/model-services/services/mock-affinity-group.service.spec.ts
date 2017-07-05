import { Injectable } from '@angular/core';
import { AffinityGroup } from '../../../../app/shared/models';
import { Observable } from 'rxjs/Observable';


const affinityGroups: Array<Object> = require('../fixtures/affinityGroups.json');

@Injectable()
export class MockAffinityGroupService {
  public getList(): Observable<Array<AffinityGroup>> {
    return Observable.of(affinityGroups.map(json => new AffinityGroup(json)));
  }
}
