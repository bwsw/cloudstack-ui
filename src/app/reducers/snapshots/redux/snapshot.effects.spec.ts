import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { MockNotificationService } from '../../../../testutils/mocks/mock-notification.service';
import { MockSnapshotTagService } from '../../../../testutils/mocks/tag-services/mock-snapshot-tag.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Snapshot, SnapshotStates } from '../../../shared/models';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { AuthService } from '../../../shared/services/auth.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { SnapshotTagService } from '../../../shared/services/tags/snapshot-tag.service';
import { VirtualMachine } from '../../../vm/shared/vm.model';
import { VirtualMachinesEffects } from '../../vm/redux/vm.effects';
import { SnapshotEffects } from './snapshot.effects';

import * as actions from './snapshot.actions';
import * as fromSnapshots from './snapshot.reducers';

@Injectable()
class MockAsyncJobService {
  public completeAllJobs(): void {
  }
}

@Injectable()
export class MockAuthService {
  public loggedIn = new Subject<boolean>();
}

@Injectable()
class MockRouter {
  public navigate(route: any): Promise<any> {
    return Promise.resolve(route);
  }
}

@Injectable()
export class MockVmEffects {
  public stop(vm: VirtualMachine) {
    return Observable.of(vm);
  }
}

@Injectable()
export class MockVmService {
}

const snapshots: Array<Snapshot> = [
  {
    description: 'test snapshot',
    id: 'test-id',
    created: '2016-01-10T15:59:42+0700',
    physicalsize: 100,
    volumeid: 'volume-id',
    virtualmachineid: undefined,
    name: 'snapshot for testing',
    tags: [],
    state: SnapshotStates.BackedUp,
    revertable: false
  }
];

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  public set stream(source: Observable<Snapshot>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Snapshot Effects', () => {
  let actions$: TestActions;
  let service: SnapshotService;
  let effects: SnapshotEffects;

  const jobsNotificationService = jasmine.createSpyObj(
    'JobsNotificationService',
    ['add', 'finish', 'fail']
  );

  const mockDialog = {
    open: jasmine.createSpy('open').and.callFake(() => {
      return {
        afterClosed: () => Observable.of(snapshots[0])
      };
    })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ ...fromSnapshots.snapshotReducers })
      ],
      providers: [
        SnapshotService,
        SnapshotEffects,
        { provide: VirtualMachinesEffects, useFactory: MockVmEffects },
        { provide: Actions, useFactory: getActions },
        { provide: AuthService, useFactory: MockAuthService },
        { provide: AsyncJobService, useClass: MockAsyncJobService },
        { provide: SnapshotTagService, useClass: MockSnapshotTagService },
        { provide: NotificationService, useValue: MockNotificationService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: DialogService, useClass: MockDialogService },
        { provide: MatDialog, useValue: mockDialog },
        {provide: Router, useClass: MockRouter }
      ]
    });
    actions$ = TestBed.get(Actions);
    service = TestBed.get(SnapshotService);
    effects = TestBed.get(SnapshotEffects);

    spyOn(service, 'getListAll').and.returnValue(of(snapshots));
  });

  it('should return a collection from LoadSnapshotResponse', () => {
    const action = new actions.LoadSnapshotRequest();
    const completion = new actions.LoadSnapshotResponse(snapshots);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadSnapshots$).toBeObservable(expected);
  });
});
