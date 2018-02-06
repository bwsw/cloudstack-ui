import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
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
import { Snapshot } from '../../../shared/models';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { AuthService } from '../../../shared/services/auth.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { SnapshotTagService } from '../../../shared/services/tags/snapshot-tag.service';
import { SnapshotEffects } from './snapshot.effects';

import * as snapshotActions from './snapshot.actions';
import * as fromSnapshots from './snapshot.reducers';
import { VirtualMachinesEffects } from '../../vm/redux/vm.effects';

@Injectable()
class MockAsyncJobService {
  public completeAllJobs(): void {
  }
}

@Injectable()
export class MockAuthService {
  public loggedIn = new Subject<boolean>();
}

class MockMatDialog {
  public open(): void {
  }
  public closeAll(): void {
  }
}


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

const snapList: Array<Snapshot> = require(
  '../../../../testutils/mocks/model-services/fixtures/snapshots.json');


describe('Snapshot Effects', () => {
  let actions$: TestActions;
  let service: SnapshotService;
  let effects: SnapshotEffects;

  const list: Array<Snapshot> = snapList;

  const jobsNotificationService = jasmine.createSpyObj(
    'JobsNotificationService',
    ['add', 'finish', 'fail']
  );

  const MockVirtualMachinesEffects = jasmine.createSpyObj(
    'VirtualMachinesEffects', [ 'stop' ]
  );


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ ...fromSnapshots.snapshotReducers })
      ],
      providers: [
        SnapshotService,
        SnapshotEffects,
        { provide: VirtualMachinesEffects, useValue: MockVirtualMachinesEffects },
        { provide: Actions, useFactory: getActions },
        { provide: AuthService, useClass: MockAuthService },
        { provide: AsyncJobService, useClass: MockAsyncJobService },
        { provide: SnapshotTagService, useClass: MockSnapshotTagService },
        { provide: NotificationService, useValue: MockNotificationService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: DialogService, useClass: MockDialogService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    });
    actions$ = TestBed.get(Actions);
    service = TestBed.get(SnapshotService);
    effects = TestBed.get(SnapshotEffects);
  });

  it('should return a collection from LoadSnapshotResponse', () => {
    spyOn(service, 'getListAll').and.returnValue(of(list));
    const action = new snapshotActions.LoadSnapshotRequest();
    const completion = new snapshotActions.LoadSnapshotResponse(list);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadSnapshots$).toBeObservable(expected);
  });

  it('should return an empty collection from LoadSnapshotResponse', () => {
    spyOn(service, 'getListAll').and.returnValue(Observable.throw(new Error('Error occurred!')));
    const action = new snapshotActions.LoadSnapshotRequest();
    const completion = new snapshotActions.LoadSnapshotResponse([]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadSnapshots$).toBeObservable(expected);
  });

  it('should delete many snapshots', () => {
    const action = new snapshotActions.DeleteSnapshots(list);
    const completion1 = new snapshotActions.DeleteSnapshot(list[0]);
    const completion2 = new snapshotActions.DeleteSnapshot(list[1]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-(bc)', { b: completion1, c: completion2 });

    expect(effects.deleteSnapshots$).toBeObservable(expected);
  });

  it('should delete one snapshot', () => {
    spyOn(service, 'remove').and.returnValue(of(list[0]));

    const action = new snapshotActions.DeleteSnapshot(list[0]);
    const completion = new snapshotActions.DeleteSnapshotSuccess(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteSnapshot$).toBeObservable(expected);
  });

  it('should return an error during deleting one snapshot', () => {
    spyOn(service, 'remove').and.returnValue(Observable.throw(new Error('Error occurred!')));

    const action = new snapshotActions.DeleteSnapshot(list[0]);
    const completion = new snapshotActions.SnapshotUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteSnapshot$).toBeObservable(expected);
  });


});
