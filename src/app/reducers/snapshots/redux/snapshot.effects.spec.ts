import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { MockSnackBarService } from '../../../../testutils/mocks/mock-snack-bar.service';
import { MockSnapshotTagService } from '../../../../testutils/mocks/tag-services/mock-snapshot-tag.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Snapshot, SnapshotStates, SnapshotType, Volume } from '../../../shared/models';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { AuthService } from '../../../shared/services/auth.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { SnackBarService } from '../../../core/services';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { SnapshotTagService } from '../../../shared/services/tags/snapshot-tag.service';
import { VirtualMachine } from '../../../vm/shared/vm.model';
import { VirtualMachinesEffects } from '../../vm/redux/vm.effects';

import * as snapshotActions from './snapshot.actions';
import { SnapshotEffects } from './snapshot.effects';
import * as fromSnapshots from './snapshot.reducers';

const snapshots: Snapshot[] = [
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
    revertable: false,
    snapshottype: SnapshotType.Manual,
  },
];

@Injectable()
class MockAsyncJobService {
  public completeAllJobs(): void {}
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
    return of(vm);
  }
}

class MockMatDialog {
  public open() {
    return {
      afterClosed: () => of(snapshots[0]),
    };
  }

  public closeAll(): void {}
}

@Injectable()
export class MockVmService {}

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  public set stream(source: Observable<Snapshot>) {
    // todo
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

const snapList: Snapshot[] = require('../../../../testutils/mocks/model-services/fixtures/snapshots.json');

describe('Snapshot Effects', () => {
  let actions$: TestActions;
  let service: SnapshotService;
  let effects: SnapshotEffects;
  let dialogService: DialogService;

  const list: Snapshot[] = snapList;

  const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', {
    add: 'notification-id',
    finish: 'notification-id',
    fail: 'notification-id',
  });

  const mockVirtualMachinesEffects = jasmine.createSpyObj('VirtualMachinesEffects', ['stop']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ ...fromSnapshots.snapshotReducers }),
      ],
      providers: [
        SnapshotService,
        SnapshotEffects,
        { provide: VirtualMachinesEffects, useValue: mockVirtualMachinesEffects },
        { provide: Actions, useFactory: getActions },
        { provide: AuthService, useClass: MockAuthService },
        { provide: AsyncJobService, useClass: MockAsyncJobService },
        { provide: SnapshotTagService, useClass: MockSnapshotTagService },
        { provide: SnackBarService, useClass: MockSnackBarService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: DialogService, useClass: MockDialogService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: Router, useClass: MockRouter },
      ],
    });
    actions$ = TestBed.get(Actions);
    service = TestBed.get(SnapshotService);
    effects = TestBed.get(SnapshotEffects);
    dialogService = TestBed.get(DialogService);
  });

  it('should return a collection from LoadSnapshotResponse', () => {
    const spyGetList = spyOn(service, 'getListAll').and.returnValue(of(list));
    const action = new snapshotActions.LoadSnapshotRequest();
    const completion = new snapshotActions.LoadSnapshotResponse(list);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadSnapshots$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should return an empty collection with error from LoadSnapshotResponse', () => {
    const spyGetList = spyOn(service, 'getListAll').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    const action = new snapshotActions.LoadSnapshotRequest();
    const completion = new snapshotActions.LoadSnapshotResponse([]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadSnapshots$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should add new snapshot', () => {
    const newSnapshot: Snapshot = {
      id: 'new-snapshot',
      description: 'new snapshot',
      created: '2018-01-10T15:59:42+0700',
      physicalsize: 100,
      volumeid: 'volume-id',
      virtualmachineid: undefined,
      name: 'new snapshot for testing',
      tags: [],
      state: SnapshotStates.BackedUp,
      revertable: true,
      snapshottype: SnapshotType.Manual,
    };

    const spyCommand = spyOn(service, 'create').and.returnValue(of(newSnapshot));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new snapshotActions.AddSnapshot({
      id: 'volume-id',
    } as Volume);
    const completion = new snapshotActions.AddSnapshotSuccess(newSnapshot);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.addSnapshot$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should catch error while adding a new snapshot', () => {
    const spyCommand = spyOn(service, 'create').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new snapshotActions.AddSnapshot({ id: 'volume-id' } as Volume);
    const completion = new snapshotActions.SnapshotUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.addSnapshot$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
  });

  it('should delete snapshot', () => {
    const spyCommand = spyOn(service, 'remove').and.returnValue(of(snapshots[0]));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new snapshotActions.DeleteSnapshot(snapshots[0]);
    const completion = new snapshotActions.DeleteSnapshotSuccess(snapshots[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteSnapshot$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should catch error while removing a snapshot', () => {
    const spyCommand = spyOn(service, 'remove').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new snapshotActions.DeleteSnapshot(snapshots[0]);
    const completion = new snapshotActions.SnapshotUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteSnapshot$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
  });

  it('should return an empty collection from LoadSnapshotResponse', () => {
    spyOn(service, 'getListAll').and.returnValue(throwError(new Error('Error occurred!')));
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
    spyOn(service, 'remove').and.returnValue(throwError(new Error('Error occurred!')));

    const action = new snapshotActions.DeleteSnapshot(list[0]);
    const completion = new snapshotActions.SnapshotUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteSnapshot$).toBeObservable(expected);
  });
});
