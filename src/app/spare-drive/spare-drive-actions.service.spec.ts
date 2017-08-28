import { Injectable } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { Volume } from '../shared/models';
import { JobsNotificationService } from '../shared/services/jobs-notification.service';
import { VolumeService } from '../shared/services/volume.service';
import { SpareDriveActionsService } from './spare-drive-actions.service';


@Injectable()
class MockVolumeService {
  public attach(params: any): Observable<Volume> {
    if (params['fail']) {
      return Observable.throw({});
    } else {
      return Observable.of(new Volume({}));
    }
  }

  public detach(id: string): Observable<void> {
    if (id === 'failId') {
      return Observable.throw({});
    } else {
      return Observable.of(null);
    }
  }
}

describe('Jobs notification service', () => {
  let spareDriveActionsService: SpareDriveActionsService;

  beforeEach(async(() => {
    const dialogService = jasmine.createSpyObj('DialogService', ['alert']);
    const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', ['add', 'finish', 'fail']);

    TestBed.configureTestingModule({
      providers: [
        SpareDriveActionsService,
        { provide: DialogService, useValue: dialogService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: VolumeService, useClass: MockVolumeService }
      ]
    });

    spareDriveActionsService = TestBed.get(SpareDriveActionsService);
  }));

  it('should attach volume', done => {
    const volumeAttachmentData = {
      id: 'testId',
      virtualMachineId: 'testVmId'
    };

    spareDriveActionsService.attach(volumeAttachmentData)
      .subscribe(
        () => done(),
        () => done.fail()
      );
  });

  it('should throw on attach', done => {
    const volumeAttachmentData = {
      id: 'testId',
      virtualMachineId: 'testVmId',
      fail: true
    };

    spareDriveActionsService.attach(volumeAttachmentData)
      .subscribe(
        () => done.fail(),
        () => done()
      );
  });

  it('should detach volume', done => {
    const volume = new Volume({});
    volume.id = 'testId';

    spareDriveActionsService.detach(volume)
      .subscribe(
        () => done(),
        () => done.fail()
      );
  });

  it('should throw on detach', done => {
    const volume = new Volume({});
    volume.id = 'failId';

    spareDriveActionsService.detach(volume)
      .subscribe(
        () => done.fail(),
        () => done()
      );
  });
});
