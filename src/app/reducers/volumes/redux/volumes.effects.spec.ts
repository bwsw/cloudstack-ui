import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import * as volumeActions from './volumes.actions';
import * as fromVolumes from './volumes.reducers';
import * as snapshotActions from '../../snapshots/redux/snapshot.actions';
import { AuthService } from '../../../shared/services/auth.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { VolumeResizeData, VolumeService } from '../../../shared/services/volume.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { SnapshotTagService } from '../../../shared/services/tags/snapshot-tag.service';
import { VolumeTagService } from '../../../shared/services/tags/volume-tag.service';
import { Router } from '@angular/router';
import { Volume } from '../../../shared/models/volume.model';
import { VolumesEffects } from './volumes.effects';
import { VirtualMachine } from '../../../vm/shared/vm.model';
import { MockSnackBarService } from '../../../../testutils/mocks/mock-snack-bar.service';
import { SnackBarService } from '../../../core/services';

@Injectable()
class MockAsyncJobService {
  public completeAllJobs(): void {}
}

@Injectable()
class MockTagService {
  public setDescription(): void {}

  public removeDescription(): void {}

  public setGroup(): void {}

  public removeGroup(): void {}
}

@Injectable()
class MockVolumeService {
  public create(): void {}
}

@Injectable()
class MockRouter {
  public navigate(route: any): Promise<any> {
    return Promise.resolve(route);
  }

  public isActive(route: any): void {}
}

@Injectable()
class MockStorageService {
  private storage: any = {
    user: {
      userid: '1',
    },
  };

  public write(key: string, value: string): void {
    this.storage[key] = value;
  }

  public read(key: string): string {
    return this.storage[key] || null;
  }

  public remove(key: string): void {
    delete this.storage[key];
  }

  public resetInMemoryStorage(): void {
    this.storage = {};
  }
}

class MockMatDialog {
  public open(): void {}

  public closeAll(): void {}
}

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  public set stream(source: Observable<Volume>) {
    // todo
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

const volumeList: Volume[] = require('../../../../testutils/mocks/model-services/fixtures/volumes.json');

class MockStore {
  reducers = new Map<any, BehaviorSubject<any>>();

  public pipe() {
    return of(volumeList);
  }
}

describe('Volume Effects', () => {
  let actions$: TestActions;
  let router: Router;
  let volumeService: VolumeService;
  let tagService: VolumeTagService;
  let dialogService: DialogService;
  let matDialog: MatDialog;
  let effects: VolumesEffects;

  const list: Volume[] = volumeList;

  const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', [
    'add',
    'finish',
    'fail',
  ]);
  jobsNotificationService.add.and.returnValue('id');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({ ...fromVolumes.volumeReducers })],
      providers: [
        VolumeService,
        SnapshotService,
        AuthService,
        VolumesEffects,
        { provide: Actions, useFactory: getActions },
        { provide: Store, useClass: MockStore },
        { provide: AsyncJobService, useClass: MockAsyncJobService },
        { provide: VolumeTagService, useClass: MockVolumeService },
        { provide: SnackBarService, useClass: MockSnackBarService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: LocalStorageService, useClass: MockStorageService },
        { provide: SnapshotTagService, useClass: MockTagService },
        { provide: VolumeTagService, useClass: MockTagService },
        { provide: Router, useClass: MockRouter },
        { provide: DialogService, useClass: MockDialogService },
        { provide: MatDialog, useClass: MockMatDialog },
      ],
    });
    actions$ = TestBed.get(Actions);
    router = TestBed.get(Router);
    volumeService = TestBed.get(VolumeService);
    tagService = TestBed.get(VolumeTagService);
    dialogService = TestBed.get(DialogService);
    matDialog = TestBed.get(MatDialog);
    effects = TestBed.get(VolumesEffects);
  });

  it('should return a collection from LoadVolumesResponse', () => {
    const spyGetList = spyOn(volumeService, 'getList').and.returnValue(of(list));

    const action = new volumeActions.LoadVolumesRequest();
    const completion = new volumeActions.LoadVolumesResponse(list);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadVolumes$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should return an empty collection from LoadVolumesResponse', () => {
    const spyGetList = spyOn(volumeService, 'getList').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new volumeActions.LoadVolumesRequest();
    const completion = new volumeActions.LoadVolumesResponse([]);

    actions$.stream = cold('a', { a: action });

    const expected = cold('a', { a: completion });
    expect(effects.loadVolumes$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should create new volume', () => {
    const spyCreate = spyOn(volumeService, 'create').and.returnValue(of(list[0]));

    const action = new volumeActions.CreateVolume({} as Volume);
    const completion = new volumeActions.CreateSuccess(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.createVolume$).toBeObservable(expected);
    expect(spyCreate).toHaveBeenCalled();
  });

  it('should return an error during creating new volume', () => {
    const spyCreate = spyOn(volumeService, 'create').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new volumeActions.CreateVolume({} as Volume);
    const completion = new volumeActions.CreateError(new Error('Error occurred!'));

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.createVolume$).toBeObservable(expected);
    expect(spyCreate).toHaveBeenCalled();
  });

  it('should change volume description', () => {
    const spySetDesc = spyOn(tagService, 'setDescription').and.returnValue(of(list[0]));

    const action = new volumeActions.ChangeDescription({
      volume: list[0],
      description: 'desc',
    });
    const completion = new volumeActions.UpdateVolume(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeDescription$).toBeObservable(expected);
    expect(spySetDesc).toHaveBeenCalled();
  });

  it('should remove volume description', () => {
    const spyRemoveDesc = spyOn(tagService, 'removeDescription').and.returnValue(of(list[0]));

    const action = new volumeActions.ChangeDescription({
      volume: list[0],
      description: '',
    });
    const completion = new volumeActions.UpdateVolume(list[0]);

    actions$.stream = hot('a', { a: action });
    const expected = cold('b', { b: completion });

    expect(effects.changeDescription$).toBeObservable(expected);
    expect(spyRemoveDesc).toHaveBeenCalled();
  });

  it('should return an error during changing volume description', () => {
    const spyRemoveDesc = spyOn(tagService, 'setDescription').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new volumeActions.ChangeDescription({
      volume: list[0],
      description: 'desc',
    });
    const completion = new volumeActions.VolumeUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.changeDescription$).toBeObservable(expected);
    expect(spyRemoveDesc).toHaveBeenCalled();
  });

  it('should attach volume', () => {
    const spyAttach = spyOn(volumeService, 'attach').and.returnValue(of(list[0]));
    spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of('vm-id1'),
      };
    });

    const action = new volumeActions.AttachVolume(list[0]);
    const completion = new volumeActions.UpdateVolume(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.attachVolume$).toBeObservable(expected);
    expect(spyAttach).toHaveBeenCalledWith({
      id: '9f027074-2a1a-4745-949a-d666ccf0a8b3',
      virtualMachineId: 'vm-id1',
    });
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not attach volume', () => {
    const spyAttach = spyOn(volumeService, 'attach');
    spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of(false),
      };
    });

    const action = new volumeActions.AttachVolume(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.attachVolume$).toBeObservable(expected);
    expect(spyAttach).not.toHaveBeenCalled();
  });

  it('should return an error during attaching volume', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyAttach = spyOn(volumeService, 'attach').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of('vm-id1'),
      };
    });

    const action = new volumeActions.AttachVolume(list[0]);
    const completion = new volumeActions.VolumeUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.attachVolume$).toBeObservable(expected);
    expect(spyAttach).toHaveBeenCalledWith({
      id: '9f027074-2a1a-4745-949a-d666ccf0a8b3',
      virtualMachineId: 'vm-id1',
    });
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should attach volume to vm', () => {
    const spyAttach = spyOn(volumeService, 'attach').and.returnValue(of(list[0]));

    const action = new volumeActions.AttachVolumeToVM({
      volumeId: '9f027074-2a1a-4745-949a-d666ccf0a8b3',
      virtualMachineId: 'vm-id1',
    });
    const completion = new volumeActions.UpdateVolume(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.attachVolumeToVM$).toBeObservable(expected);
    expect(spyAttach).toHaveBeenCalledWith({
      id: '9f027074-2a1a-4745-949a-d666ccf0a8b3',
      virtualMachineId: 'vm-id1',
    });
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during attaching volume to vm', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyAttach = spyOn(volumeService, 'attach').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new volumeActions.AttachVolumeToVM({
      volumeId: '9f027074-2a1a-4745-949a-d666ccf0a8b3',
      virtualMachineId: 'vm-id1',
    });
    const completion = new volumeActions.VolumeUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.attachVolumeToVM$).toBeObservable(expected);
    expect(spyAttach).toHaveBeenCalledWith({
      id: '9f027074-2a1a-4745-949a-d666ccf0a8b3',
      virtualMachineId: 'vm-id1',
    });
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should detach volume', () => {
    const spyDetach = spyOn(volumeService, 'detach').and.returnValue(of(list[0]));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new volumeActions.DetachVolume(list[0]);
    const completion = new volumeActions.ReplaceVolume(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.detachVolume$).toBeObservable(expected);
    expect(spyDetach).toHaveBeenCalledWith(list[0]);
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not detach volume', () => {
    const spyDetach = spyOn(volumeService, 'detach');
    spyOn(dialogService, 'confirm').and.returnValue(of(false));

    const action = new volumeActions.DetachVolume(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.detachVolume$).toBeObservable(expected);
    expect(spyDetach).not.toHaveBeenCalled();
  });

  it('should return an error during detaching volume', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyDetach = spyOn(volumeService, 'detach').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new volumeActions.DetachVolume(list[0]);
    const completion = new volumeActions.VolumeUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.detachVolume$).toBeObservable(expected);
    expect(spyDetach).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should resize volume', () => {
    const spyResize = spyOn(volumeService, 'resize').and.returnValue(of(list[0]));
    spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of({} as VolumeResizeData),
      };
    });

    const action = new volumeActions.ResizeVolume(list[0]);
    const completion = new volumeActions.ResizeVolumeSuccess(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.resizeVolume$).toBeObservable(expected);
    expect(spyResize).toHaveBeenCalledWith({} as VolumeResizeData);
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not resize volume', () => {
    const spyResize = spyOn(volumeService, 'resize');
    spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of(false),
      };
    });

    const action = new volumeActions.ResizeVolume(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.resizeVolume$).toBeObservable(expected);
    expect(spyResize).not.toHaveBeenCalled();
  });

  it('should return an error during resizing volume', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyResize = spyOn(volumeService, 'resize').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of({} as VolumeResizeData),
      };
    });

    const action = new volumeActions.ResizeVolume(list[0]);
    const completion = new volumeActions.VolumeUpdateError(new Error('Error occurred!'));

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.resizeVolume$).toBeObservable(expected);
    expect(spyResize).toHaveBeenCalledWith({} as VolumeResizeData);
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should delete volumes with snaps', () => {
    const spyDialog = spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of({ deleteSnapshots: true }),
      };
    });

    const action = new volumeActions.DeleteVolumes({
      vm: { id: '968d3edc-9837-4063-a539-95304b02fe95' } as VirtualMachine,
      expunged: false,
    });
    const completion1 = new snapshotActions.DeleteSnapshots(list[2].snapshots);
    const completion2 = new volumeActions.DeleteVolume(list[2]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-(bc)', { b: completion1, c: completion2 });

    expect(effects.deleteVolumes$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
  });

  it('should delete volumes without shanps', () => {
    const spyDialog = spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of(true),
      };
    });

    const action = new volumeActions.DeleteVolumes({
      vm: { id: '375c62b5-74d9-4494-8b79-0d7c76cff10f' } as VirtualMachine,
      expunged: false,
    });
    const completion = new volumeActions.DeleteVolume(list[1]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteVolumes$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
  });

  it('should detach and delete volume', () => {
    const spyDetach = spyOn(volumeService, 'detach').and.returnValue(of(list[0]));
    const spyRemove = spyOn(volumeService, 'remove').and.returnValue(of({} as Volume));

    const action = new volumeActions.DeleteVolume(list[0]);
    const completion = new volumeActions.DeleteSuccess(list[0]);

    actions$.stream = cold('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteVolume$).toBeObservable(expected);
    expect(spyDetach).toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should delete volume', () => {
    const spyDetach = spyOn(volumeService, 'detach');
    const spyRemove = spyOn(volumeService, 'remove').and.returnValue(of({} as Volume));

    const action = new volumeActions.DeleteVolume(list[3]);
    const completion = new volumeActions.DeleteSuccess(list[3]);

    actions$.stream = cold('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteVolume$).toBeObservable(expected);
    expect(spyDetach).not.toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during detaching volume (delete volume)', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyDetach = spyOn(volumeService, 'detach').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    const spyRemove = spyOn(volumeService, 'remove');

    const action = new volumeActions.DeleteVolume(list[0]);

    actions$.stream = cold('a', { a: action });
    const expected = cold('', []);

    expect(effects.deleteVolume$).toBeObservable(expected);
    expect(spyDetach).toHaveBeenCalled();
    expect(spyRemove).not.toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should return an error during deleting volume (without detach)', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyDetach = spyOn(volumeService, 'detach');
    const spyRemove = spyOn(volumeService, 'remove').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new volumeActions.DeleteVolume(list[3]);
    const completion = new volumeActions.VolumeUpdateError(new Error('Error occurred!'));

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.deleteVolume$).toBeObservable(expected);
    expect(spyDetach).not.toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should navigate after successful deleting', () => {
    const spyNavigate = spyOn(router, 'navigate');
    spyOn(router, 'isActive').and.returnValue(true);
    const action = new volumeActions.DeleteSuccess(list[0]);

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: list[0] });

    expect(effects.deleteVolumeSuccessNavigate$).toBeObservable(expected);
    expect(spyNavigate).toHaveBeenCalled();
  });

  it('should not navigate after successful deleting', () => {
    const spyNavigate = spyOn(router, 'navigate');
    spyOn(router, 'isActive').and.returnValue(false);
    const action = new volumeActions.DeleteSuccess(list[0]);

    actions$.stream = hot('a', { a: action });
    const expected = cold('', []);

    expect(effects.deleteVolumeSuccessNavigate$).toBeObservable(expected);
    expect(spyNavigate).not.toHaveBeenCalled();
  });

  it('should show alert after creation error', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const error = new Error('Error');
    spyOn(volumeService, 'create').and.returnValue(throwError(error));
    const action = new volumeActions.CreateVolume({
      name: '',
      zoneid: '',
      diskofferingid: '',
    });
    const completion = new volumeActions.CreateError(error);

    actions$.stream = cold('a', { a: action });
    const expected = cold('b', { b: completion });

    expect(effects.createVolume$).toBeObservable(expected);
    expect(spyAlert).toHaveBeenCalled();
  });
});
