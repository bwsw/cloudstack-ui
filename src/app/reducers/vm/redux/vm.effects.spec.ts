import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { VmService } from '../../../vm';
import { VirtualMachinesEffects } from './vm.effects';
import { State } from '../../index';
import * as vmActions from './vm.actions';
import * as volumeActions from '../../volumes/redux/volumes.actions';
import * as sgActions from '../../security-groups/redux/sg.actions';
import * as fromVMs from './vm.reducers';
import { VirtualMachine, VmState } from '../../../vm/shared/vm.model';
import { OsTypeService } from '../../../shared/services/os-type.service';
import { AuthService } from '../../../shared/services/auth.service';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { VolumeService } from '../../../shared/services/volume.service';
import { SnapshotService } from '../../../shared/services/snapshot.service';
import { SnapshotTagService } from '../../../shared/services/tags/snapshot-tag.service';
import { VolumeTagService } from '../../../shared/services/tags/volume-tag.service';
import { IsoService } from '../../../template/shared/iso.service';
import { TemplateTagService } from '../../../shared/services/tags/template-tag.service';
import { Router } from '@angular/router';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { InstanceGroup } from '../../../shared/models/instance-group.model';
import { Color } from '../../../shared/models/color.model';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';
// tslint:disable-next-line
import { ProgressLoggerMessageStatus } from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { MockSnackBarService } from '../../../../testutils/mocks/mock-snack-bar.service';
import { SnackBarService } from '../../../core/services';
import { MockTagService } from '../../../../testutils/mocks/tag-services/mock-tag.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import { HttpAccessService, SshAccessService, VncAccessService } from '../../../vm/services';

@Injectable()
export class MockAccessService {}

@Injectable()
class MockAsyncJobService {
  public completeAllJobs(): void {}
}

@Injectable()
class MockVMTagService {
  public setDescription(): void {}
  public removeDescription(): void {}
  public setGroup(): void {}
  public removeGroup(): void {}
  public setColor(): void {}
  public setSavePasswordForAllVms(): void {}
  public setPassword(): void {}
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
}

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  public set stream(source: Observable<VirtualMachine>) {
    // todo
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

const vmsList: VirtualMachine[] = require('../../../../testutils/mocks/model-services/fixtures/vms.json');

describe('Virtual machine Effects', () => {
  let actions$: TestActions;
  let store: Store<State>;
  let router: Router;
  let service: VmService;
  let isoService: IsoService;
  let sshService: SSHKeyPairService;
  let tagService: VmTagService;
  let afGroupService: AffinityGroupService;
  let dialogService: DialogService;
  let matDialog: MatDialog;
  let effects: VirtualMachinesEffects;

  const list: VirtualMachine[] = vmsList;

  const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', [
    'add',
    'finish',
    'fail',
  ]);
  jobsNotificationService.add.and.returnValue('id');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ ...fromVMs.virtualMachineReducers }),
      ],
      providers: [
        VmService,
        VolumeService,
        SnapshotService,
        IsoService,
        AuthService,
        OsTypeService,
        AffinityGroupService,
        SSHKeyPairService,
        VirtualMachinesEffects,
        { provide: Actions, useFactory: getActions },
        { provide: AsyncJobService, useClass: MockAsyncJobService },
        { provide: VmTagService, useClass: MockVMTagService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: LocalStorageService, useClass: MockStorageService },
        { provide: SnapshotTagService, useClass: MockVMTagService },
        { provide: VolumeTagService, useClass: MockVMTagService },
        { provide: TemplateTagService, useClass: MockVMTagService },
        { provide: Router, useClass: MockRouter },
        { provide: DialogService, useClass: MockDialogService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: SnackBarService, useClass: MockSnackBarService },
        { provide: TagService, useClass: MockTagService },
        { provide: HttpAccessService, useClass: MockAccessService },
        { provide: SshAccessService, useClass: MockAccessService },
        { provide: VncAccessService, useClass: MockAccessService },
      ],
    });
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    service = TestBed.get(VmService);
    isoService = TestBed.get(IsoService);
    sshService = TestBed.get(SSHKeyPairService);
    tagService = TestBed.get(VmTagService);
    afGroupService = TestBed.get(AffinityGroupService);
    dialogService = TestBed.get(DialogService);
    matDialog = TestBed.get(MatDialog);
    effects = TestBed.get(VirtualMachinesEffects);
  });

  it('should return a collection from LoadVMsRequest', () => {
    const spyGetList = spyOn(service, 'getList').and.returnValue(of(list));

    const action = new vmActions.LoadVMsRequest();
    const completion = new vmActions.LoadVMsResponse(list);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadVMs$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should return an empty collection from LoadVMsRequest', () => {
    const spyGetList = spyOn(service, 'getList').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.LoadVMsRequest();
    const completion = new vmActions.LoadVMsResponse([]);

    actions$.stream = cold('a', { a: action });

    const expected = cold('a', { a: completion });
    expect(effects.loadVMs$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should return a object from LoadVMRequest', () => {
    const spyGetList = spyOn(service, 'getList').and.returnValue(of([list[0]]));

    const action = new vmActions.LoadVMRequest('e10da283-06b1-4ac5-9888-b4f3717c2fe1');
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadVM$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalledWith('e10da283-06b1-4ac5-9888-b4f3717c2fe1');
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error from LoadVMRequest', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyGetList = spyOn(service, 'getList').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.LoadVMRequest('e10da283-06b1-4ac5-9888-b4f3717c2fe1');
    const completion = new vmActions.VMUpdateError({ error: new Error('Error occurred!') });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.loadVM$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalledWith('e10da283-06b1-4ac5-9888-b4f3717c2fe1');
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should change description', () => {
    const spySetDesc = spyOn(tagService, 'setDescription').and.returnValue(of(list[0]));

    const action = new vmActions.ChangeDescription({
      description: 'description',
      vm: list[0],
    });
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeDescription$).toBeObservable(expected);
    expect(spySetDesc).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should remove description', () => {
    const spyRemoveDesc = spyOn(tagService, 'removeDescription').and.returnValue(of(list[0]));

    const action = new vmActions.ChangeDescription({
      description: '',
      vm: list[0],
    });
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeDescription$).toBeObservable(expected);
    expect(spyRemoveDesc).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during changing description', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spySetDesc = spyOn(tagService, 'setDescription').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.ChangeDescription({
      description: 'desc',
      vm: list[0],
    });
    const completion = new vmActions.VMUpdateError({ error: new Error('Error occurred!') });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.changeDescription$).toBeObservable(expected);
    expect(spySetDesc).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should change service offering for stopped vm', () => {
    const spyChangeSO = spyOn(service, 'changeServiceOffering').and.returnValue(of(list[1]));

    const action = new vmActions.ChangeServiceOffering({
      offering: {} as ServiceOffering,
      vm: list[1],
    });
    const completion = new vmActions.UpdateVM(list[1]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeServiceOffering$).toBeObservable(expected);
    expect(spyChangeSO).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should change service offering for running vm', () => {
    const spyChangeSO = spyOn(service, 'changeServiceOffering').and.returnValue(of(list[0]));
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[0]));

    const action = new vmActions.ChangeServiceOffering({
      offering: {} as ServiceOffering,
      vm: list[0],
    });
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeServiceOffering$).toBeObservable(expected);
    expect(spyChangeSO).toHaveBeenCalled();
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during changing service offering', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyChangeSO = spyOn(service, 'changeServiceOffering').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.ChangeServiceOffering({
      offering: {} as ServiceOffering,
      vm: list[1],
    });
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Stopped,
      vm: list[1],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.changeServiceOffering$).toBeObservable(expected);
    expect(spyChangeSO).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should change affinity group for stopped vm', () => {
    const spyChangeAG = spyOn(afGroupService, 'updateForVm').and.returnValue(of(list[1]));

    const action = new vmActions.ChangeAffinityGroup({
      affinityGroupIds: ['af1_id'],
      vm: list[1],
    });
    const completion = new vmActions.UpdateVM(list[1]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeAffinityGroup$).toBeObservable(expected);
    expect(spyChangeAG).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should change affinity group for running vm', () => {
    const spyChangeAG = spyOn(afGroupService, 'updateForVm').and.returnValue(of(list[0]));
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[0]));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.ChangeAffinityGroup({
      affinityGroupIds: ['af1_id'],
      vm: list[0],
    });
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeAffinityGroup$).toBeObservable(expected);
    expect(spyChangeAG).toHaveBeenCalled();
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not change affinity group for running vm', () => {
    const spyChangeAG = spyOn(afGroupService, 'updateForVm');
    const spyCommand = spyOn(service, 'command');
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(false));

    const action = new vmActions.ChangeAffinityGroup({
      affinityGroupIds: ['af1_id'],
      vm: list[0],
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.changeAffinityGroup$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyChangeAG).not.toHaveBeenCalled();
    expect(spyCommand).not.toHaveBeenCalled();
  });

  it('should return an error during changing affinity group', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyChangeAG = spyOn(afGroupService, 'updateForVm').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.ChangeAffinityGroup({
      affinityGroupIds: ['af1_id'],
      vm: list[1],
    });
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Stopped,
      vm: list[1],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.changeAffinityGroup$).toBeObservable(expected);
    expect(spyChangeAG).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should change instance group', () => {
    const spyChangeGroup = spyOn(tagService, 'setGroup').and.returnValue(of(list[0]));

    const action = new vmActions.ChangeInstanceGroup({
      group: {} as InstanceGroup,
      vm: list[0],
    });
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeInstanceGroup$).toBeObservable(expected);
    expect(spyChangeGroup).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during changing instance group', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyChangeGroup = spyOn(tagService, 'setGroup').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.ChangeInstanceGroup({
      group: {} as InstanceGroup,
      vm: list[0],
    });
    const completion = new vmActions.VMUpdateError({ error: new Error('Error occurred!') });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.changeInstanceGroup$).toBeObservable(expected);
    expect(spyChangeGroup).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should remove instance group', () => {
    const spyRemoveGroup = spyOn(tagService, 'removeGroup').and.returnValue(of(list[0]));

    const action = new vmActions.RemoveInstanceGroup(list[0]);
    const completion = new vmActions.UpdateVM({ ...list[0], tags: [] });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.removeInstanceGroup$).toBeObservable(expected);
    expect(spyRemoveGroup).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during removing instance group', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyRemoveGroup = spyOn(tagService, 'removeGroup').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.RemoveInstanceGroup(list[0]);
    const completion = new vmActions.VMUpdateError({ error: new Error('Error occurred!') });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.removeInstanceGroup$).toBeObservable(expected);
    expect(spyRemoveGroup).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should add secondary ip', () => {
    const spyAddIp = spyOn(service, 'addIpToNic').and.returnValue(
      of({
        nicsecondaryip: {
          id: 'id1',
          ipaddress: 'ip1',
        },
      }),
    );

    const action = new vmActions.AddSecondaryIp({
      vm: list[0],
      nicId: 'id1',
    });
    const completion = new vmActions.LoadVirtualMachine({ id: list[0].id });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.addSecondaryIp$).toBeObservable(expected);
    expect(spyAddIp).toHaveBeenCalled();
  });

  it('should remove secondary ip', () => {
    const spyRemoveIp = spyOn(service, 'removeIpFromNic').and.returnValue(of(list[2]));

    const action = new vmActions.RemoveSecondaryIp({
      vm: list[2],
      id: 'id1',
    });
    const completion = new vmActions.LoadVirtualMachine({ id: list[2].id });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.removeSecondaryIp$).toBeObservable(expected);
    expect(spyRemoveIp).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should change vm color', () => {
    const spyChangeColor = spyOn(tagService, 'setColor').and.returnValue(of(list[0]));

    const action = new vmActions.ChangeVmColor({
      color: new Color(),
      vm: list[0],
    });
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeColor$).toBeObservable(expected);
    expect(spyChangeColor).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during changing vm color', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyChangeColor = spyOn(tagService, 'setColor').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.ChangeVmColor({
      color: new Color(),
      vm: list[0],
    });
    const completion = new vmActions.VMUpdateError({ error: new Error('Error occurred!') });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.changeColor$).toBeObservable(expected);
    expect(spyChangeColor).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should stop vm', () => {
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[0]));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.StopVm(list[0]);
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.stopVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during stopping vm', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyCommand = spyOn(service, 'command').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.StopVm(list[0]);
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Error,
      vm: list[0],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.stopVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should start vm', () => {
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[1]));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.StartVm(list[1]);
    const completion = new vmActions.UpdateVM(list[1]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.startVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during starting vm', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyCommand = spyOn(service, 'command').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.StartVm(list[1]);
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Error,
      vm: list[1],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.startVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should destroy vm without expunge', () => {
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[1]));
    const spyDialog = spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of(true),
      };
    });

    const action = new vmActions.DestroyVm(list[1]);
    const completion1 = new vmActions.UpdateVM(list[1]);
    const completion2 = new volumeActions.DeleteVolumes({ vm: list[1], expunged: false });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-(bc)', { b: completion1, c: completion2 });

    expect(effects.destroyVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyDialog).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should destroy vm with expunge', () => {
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[1]));
    const spyDialog = spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of({ expunge: true }),
      };
    });

    const action = new vmActions.DestroyVm(list[1]);
    const completion1 = new vmActions.ExpungeVmSuccess(list[1]);
    const completion2 = new volumeActions.DeleteVolumes({ vm: list[1], expunged: true });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-(bc)', { b: completion1, c: completion2 });

    expect(effects.destroyVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyDialog).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not destroy vm', () => {
    const spyCommand = spyOn(service, 'command');
    const spyDialog = spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of(false),
      };
    });

    const action = new vmActions.DestroyVm(list[1]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.destroyVm$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyCommand).not.toHaveBeenCalled();
  });

  it('should return an error during destroying vm', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyCommand = spyOn(service, 'command').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(matDialog, 'open').and.callFake(() => {
      return {
        afterClosed: () => of(true),
      };
    });

    const action = new vmActions.DestroyVm(list[1]);
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Error,
      vm: list[1],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.destroyVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should reboot vm', () => {
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[0]));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.RebootVm(list[0]);
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.rebootVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not reboot vm', () => {
    const spyCommand = spyOn(service, 'command');
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(false));

    const action = new vmActions.RebootVm(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.rebootVm$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyCommand).not.toHaveBeenCalled();
  });

  it('should return an error during rebooting vm', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyCommand = spyOn(service, 'command').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.RebootVm(list[0]);
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Error,
      vm: list[0],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.rebootVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should restore vm', () => {
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[0]));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.RestoreVm(list[0]);
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.restoreVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not restore vm', () => {
    const spyCommand = spyOn(service, 'command');
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(false));

    const action = new vmActions.RestoreVm(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.restoreVm$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyCommand).not.toHaveBeenCalled();
  });

  it('should return an error during restoring vm', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyCommand = spyOn(service, 'command').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.RestoreVm(list[0]);
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Error,
      vm: list[0],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.restoreVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should recover vm', () => {
    const spyCommand = spyOn(service, 'commandSync').and.returnValue(
      of({
        virtualmachine: list[0],
      }),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.RecoverVm(list[0]);
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.recoverVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not recover vm', () => {
    const spyCommand = spyOn(service, 'commandSync');
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(false));

    const action = new vmActions.RecoverVm(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.recoverVm$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyCommand).not.toHaveBeenCalled();
  });

  it('should return an error during recovering vm', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyCommand = spyOn(service, 'commandSync').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.RecoverVm(list[0]);
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Error,
      vm: list[0],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.recoverVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should expunge vm', () => {
    const spyCommand = spyOn(service, 'command').and.returnValue(
      of({
        virtualmachine: list[0],
      }),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.ExpungeVm(list[0]);
    const completion1 = new vmActions.ExpungeVmSuccess(list[0]);
    const completion2 = new sgActions.DeletePrivateSecurityGroup(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-(bc)', { b: completion1, c: completion2 });

    expect(effects.expungeVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not expunge vm', () => {
    const spyCommand = spyOn(service, 'command');
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(false));

    const action = new vmActions.ExpungeVm(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.expungeVm$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyCommand).not.toHaveBeenCalled();
  });

  it('should return an error during expunging vm', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyCommand = spyOn(service, 'command').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.ExpungeVm(list[0]);
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.expungeVm$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should attach Iso to vm', () => {
    const spyAttach = spyOn(isoService, 'attach').and.returnValue(of(list[0]));

    const action = new vmActions.AttachIso({
      id: 'id1',
      virtualMachineId: 'e10da283-06b1-4ac5-9888-b4f3717c2fe1',
    });
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.attachIso$).toBeObservable(expected);
    expect(spyAttach).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during attaching Iso', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyAttach = spyOn(isoService, 'attach').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.AttachIso({
      id: 'id1',
      virtualMachineId: 'e10da283-06b1-4ac5-9888-b4f3717c2fe1',
    });
    const completion = new vmActions.VMUpdateError({ error: new Error('Error occurred!') });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.attachIso$).toBeObservable(expected);
    expect(spyAttach).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should detach Iso', () => {
    const spyDetach = spyOn(isoService, 'detach').and.returnValue(of(list[0]));

    const action = new vmActions.DetachIso({
      virtualMachineId: 'e10da283-06b1-4ac5-9888-b4f3717c2fe1',
    });
    const completion = new vmActions.ReplaceVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.detachIso$).toBeObservable(expected);
    expect(spyDetach).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should return an error during detaching Iso', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyDetach = spyOn(isoService, 'detach').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.DetachIso({
      virtualMachineId: 'e10da283-06b1-4ac5-9888-b4f3717c2fe1',
    });
    const completion = new vmActions.VMUpdateError({ error: new Error('Error occurred!') });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.detachIso$).toBeObservable(expected);
    expect(spyDetach).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should change ssh-key for stopped vm', () => {
    const spyChangeKey = spyOn(sshService, 'reset').and.returnValue(of(list[1]));

    const action = new vmActions.ChangeSshKey({
      keyPair: {} as SSHKeyPair,
      vm: list[1],
    });
    const completion = new vmActions.UpdateVM(list[1]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeSshKey$).toBeObservable(expected);
    expect(spyChangeKey).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should change ssh-key for running vm', () => {
    const spyChangeKey = spyOn(sshService, 'reset').and.returnValue(of(list[0]));
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[0]));
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.ChangeSshKey({
      keyPair: {} as SSHKeyPair,
      vm: list[0],
    });
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.changeSshKey$).toBeObservable(expected);
    expect(spyChangeKey).toHaveBeenCalled();
    expect(spyCommand).toHaveBeenCalledTimes(2);
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not change ssh-key for running vm', () => {
    const spyChangeKey = spyOn(sshService, 'reset');
    const spyCommand = spyOn(service, 'command');
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(false));

    const action = new vmActions.ChangeSshKey({
      keyPair: {} as SSHKeyPair,
      vm: list[0],
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.changeSshKey$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyChangeKey).not.toHaveBeenCalled();
    expect(spyCommand).not.toHaveBeenCalled();
  });

  it('should return an error during changing ssh-key', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyChangeKey = spyOn(sshService, 'reset').and.returnValue(
      throwError(new Error('Error occurred!')),
    );

    const action = new vmActions.ChangeSshKey({
      keyPair: {} as SSHKeyPair,
      vm: list[1],
    });
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Stopped,
      vm: list[1],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.changeSshKey$).toBeObservable(expected);
    expect(spyChangeKey).toHaveBeenCalled();
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should reset password for stopped vm', () => {
    const spyResetPass = spyOn(service, 'command').and.returnValue(of(list[1]));
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(true));
    spyOn(matDialog, 'open');

    const action = new vmActions.ResetPasswordVm(list[1]);
    const completion = new vmActions.UpdateVM(list[1]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.resetPassword$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyResetPass).toHaveBeenCalled();
    expect(matDialog.open).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should reset password for running vm', () => {
    const spyCommand = spyOn(service, 'command').and.returnValue(of(list[0]));
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(true));
    spyOn(matDialog, 'open');

    const action = new vmActions.ResetPasswordVm(list[0]);
    const completion = new vmActions.UpdateVM(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.resetPassword$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyCommand).toHaveBeenCalledWith(list[0], 'resetPasswordFor');
    expect(spyCommand).toHaveBeenCalled();
    expect(matDialog.open).toHaveBeenCalled();
    expect(jobsNotificationService.add).toHaveBeenCalled();
  });

  it('should not reset password for running vm', () => {
    const spyCommand = spyOn(service, 'command');
    const spyDialog = spyOn(dialogService, 'confirm').and.returnValue(of(false));

    const action = new vmActions.ResetPasswordVm(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.resetPassword$).toBeObservable(expected);
    expect(spyDialog).toHaveBeenCalled();
    expect(spyCommand).not.toHaveBeenCalled();
  });

  it('should return an error during reseting password', () => {
    const spyAlert = spyOn(dialogService, 'showNotificationsOnFail');
    const spyCommand = spyOn(service, 'command').and.returnValue(
      throwError(new Error('Error occurred!')),
    );
    spyOn(dialogService, 'confirm').and.returnValue(of(true));

    const action = new vmActions.ResetPasswordVm(list[1]);
    const completion = new vmActions.VMUpdateError({
      error: new Error('Error occurred!'),
      state: VmState.Error,
      vm: list[1],
    });

    actions$.stream = cold('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.resetPassword$).toBeObservable(expected);
    expect(spyCommand).toHaveBeenCalledWith(list[1], 'resetPasswordFor');
    expect(spyAlert).toHaveBeenCalled();
  });

  it('should update error with state', () => {
    const spyDispatch = spyOn(store, 'dispatch');
    const action = new vmActions.VMUpdateError({
      state: VmState.Stopped,
      vm: list[0],
      error: new Error('error'),
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-a', { a: action });

    expect(effects.updateError$).toBeObservable(expected);
    expect(spyDispatch).toHaveBeenCalled();
  });

  it('should update error without state', () => {
    const spyDispatch = spyOn(store, 'dispatch');
    const action = new vmActions.VMUpdateError({
      error: new Error('error'),
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-a', { a: action });

    expect(effects.updateError$).toBeObservable(expected);
    expect(spyDispatch).not.toHaveBeenCalled();
  });

  it('should navigate after successful expunging', () => {
    const spyNavigate = spyOn(router, 'navigate');
    spyOn(router, 'isActive').and.returnValue(true);
    const action = new vmActions.ExpungeVmSuccess(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-a', { a: list[0] });

    expect(effects.expungeSuccess$).toBeObservable(expected);
    expect(spyNavigate).toHaveBeenCalled();
  });

  it('should not navigate after successful expunging', () => {
    const spyNavigate = spyOn(router, 'navigate');
    spyOn(router, 'isActive').and.returnValue(false);
    const action = new vmActions.ExpungeVmSuccess(list[0]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('', []);

    expect(effects.expungeSuccess$).toBeObservable(expected);
    expect(spyNavigate).not.toHaveBeenCalled();
  });

  it('should load volumes after successful deployment', () => {
    const action = new vmActions.DeploymentRequestSuccess(list[0]);
    const completion1 = new volumeActions.LoadVolumesRequest();
    const completion2 = new vmActions.DeploymentAddLoggerMessage({
      text: 'VM_PAGE.VM_CREATION.DEPLOYMENT_FINISHED',
      status: [ProgressLoggerMessageStatus.Highlighted],
    });

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-(bc)', { b: completion1, c: completion2 });

    expect(effects.vmCreateSuccessLoadVolumes$).toBeObservable(expected);
  });
});
