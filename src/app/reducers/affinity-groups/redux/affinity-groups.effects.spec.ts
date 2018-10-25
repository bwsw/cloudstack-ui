import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { AffinityGroup, AffinityGroupType, DiskOffering } from '../../../shared/models';
import { TestStore } from '../../../../testutils/ngrx-test-store';

import * as actions from './affinity-groups.actions';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { AffinityGroupsEffects } from './affinity-groups.effects';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { Injectable } from '@angular/core';

@Injectable()
class MockAsyncJobService {
  public completeAllJobs(): void {}
}

const affinityGroups: AffinityGroup[] = [
  {
    id: 'test-id',
    name: 'test-name',
    type: AffinityGroupType.affinity,
    description: 'test-description',
  },
];

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  public set stream(source: Observable<DiskOffering>) {
    // todo
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Affinity Groups Effects', () => {
  let actions$: TestActions;
  let service: AffinityGroupService;
  let effects: AffinityGroupsEffects;
  let store: TestStore<any>;
  let dialogService: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AffinityGroupService,
        AffinityGroupsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: Store, useClass: TestStore },
        { provide: DialogService, useClass: MockDialogService },
        { provide: AsyncJobService, useClass: MockAsyncJobService },
      ],
    });
    actions$ = TestBed.get(Actions);
    service = TestBed.get(AffinityGroupService);
    effects = TestBed.get(AffinityGroupsEffects);
    store = TestBed.get(Store);
    dialogService = TestBed.get(DialogService);

    spyOn(service, 'getList').and.returnValue(of(affinityGroups));
  });

  it('should return a collection from LoadAffinityGroupsRequest', () => {
    const action = new actions.LoadAffinityGroupsRequest();
    const completion = new actions.LoadAffinityGroupsResponse(affinityGroups);
    store.setState([]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadAffinityGroups$).toBeObservable(expected);
  });

  it('should show alert after creation error', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const error = new Error('Error');
    spyOn(service, 'create').and.returnValue(throwError(error));
    const action = new actions.CreateAffinityGroup({
      id: '',
      name: '',
      type: AffinityGroupType.affinity,
    });
    const completion = new actions.CreateAffinityGroupError(error);

    actions$.stream = cold('a', { a: action });
    const expected = cold('b', { b: completion });

    expect(effects.createAffinityGroup$).toBeObservable(expected);
    expect(spyAlert).toHaveBeenCalled();
  });
});
