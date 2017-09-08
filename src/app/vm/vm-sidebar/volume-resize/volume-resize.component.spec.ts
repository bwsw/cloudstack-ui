import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { DiskOfferingComponent } from '../../../shared/components/disk-offering/disk-offering.component';
import { OverlayLoadingComponent } from '../../../shared/components/overlay-loading/overlay-loading.component';
import { SliderComponent } from '../../../shared/components/slider/slider.component';
import { DiskOffering, Volume } from '../../../shared/models';
import { VolumeType } from '../../../shared/models/volume.model';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { VolumeService } from '../../../shared/services/volume.service';
import { VolumeResizeComponent } from './volume-resize.component';
import { ResourceUsageService } from '../../../shared/services/resource-usage.service';


@Injectable()
class MockResourceUsageService {
  public availableStorage = 1000000;

  public getResourceUsage(): Observable<any> {
    return Observable.of({
      available: {
        primaryStorage: this.availableStorage
      }
    });
  }
}

@Injectable()
class MockVolumeService {
  public resize(): Observable<Volume> {
    return Observable.of(new Volume(''));
  }
}

@Injectable()
class MockDiskOfferingService {
  public get(): Observable<any> {
    return Observable.of([]);
  }
}

@Pipe({
  // tslint:disable-next-line
  name: 'division'
})
export class MockDivisionPipe implements PipeTransform {
  public transform(): number|string {
    return 0;
  }
}

describe('volume resize for root disks', () => {
  let component: VolumeResizeComponent;
  let volumeService;

  beforeEach(async(() => {
    let fixture;

    const dialog = jasmine.createSpyObj('MdDialogRef', ['close']);
    const dialogService = jasmine.createSpyObj('DialogService', ['alert']);
    const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', ['add', 'finish', 'fail']);

    const testVolume = new Volume('');
    testVolume.id = '1';
    testVolume.size = 1;
    testVolume.type = VolumeType.ROOT;

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        DiskOfferingComponent,
        OverlayLoadingComponent,
        MockDivisionPipe,
        MockTranslatePipe,
        SliderComponent,
        VolumeResizeComponent
      ],
      providers: [
        { provide: DialogService, useValue: dialogService },
        { provide: DiskOfferingService, useClass: MockDiskOfferingService },
        { provide: ResourceUsageService, useClass: MockResourceUsageService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: MdDialogRef, useValue: dialog },
        { provide: VolumeService, useClass: MockVolumeService },
        { provide: MD_DIALOG_DATA, useValue: { volume: testVolume } }
      ]
    });

    fixture = TestBed
      .overrideComponent(DiskOfferingComponent, { set: { template: '' }})
      .overrideComponent(OverlayLoadingComponent, { set: { template: '' }})
      .overrideComponent(SliderComponent, { set: { template: '' }})
      .createComponent(VolumeResizeComponent);

    volumeService = TestBed.get(VolumeService);
    component = fixture.componentInstance;
  }));

  it('should not send disk offerings when resizing root disks', () => {
    const newVolumeSize = 100;
    spyOn(volumeService, 'resize').and.callThrough();
    component.newSize = newVolumeSize;

    const diskOffering = new DiskOffering();
    diskOffering.id = 'diskOfferingId';
    component.diskOffering = diskOffering;

    component.resizeVolume();
    expect(volumeService.resize).toHaveBeenCalledWith({
      id: '1',
      size: newVolumeSize
    });
  });
});

describe('volume resize for data disks', () => {
  let component: VolumeResizeComponent;
  let volumeService;

  beforeEach(async(() => {
    let fixture;

    const dialog = jasmine.createSpyObj('MdDialogRef', ['close']);
    const dialogService = jasmine.createSpyObj('DialogService', ['alert']);
    const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', ['add', 'finish', 'fail']);

    const testVolume = new Volume('');
    testVolume.id = '1';
    testVolume.size = 1;
    testVolume.type = VolumeType.DATADISK;

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        DiskOfferingComponent,
        OverlayLoadingComponent,
        MockDivisionPipe,
        MockTranslatePipe,
        SliderComponent,
        VolumeResizeComponent
      ],
      providers: [
        { provide: DialogService, useValue: dialogService },
        { provide: DiskOfferingService, useClass: MockDiskOfferingService },
        { provide: ResourceUsageService, useClass: MockResourceUsageService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: MdDialogRef, useValue: dialog },
        { provide: VolumeService, useClass: MockVolumeService },
        { provide: MD_DIALOG_DATA, useValue: { volume: testVolume } }
      ]
    });

    fixture = TestBed
      .overrideComponent(DiskOfferingComponent, { set: { template: '' }})
      .overrideComponent(OverlayLoadingComponent, { set: { template: '' }})
      .overrideComponent(SliderComponent, { set: { template: '' }})
      .createComponent(VolumeResizeComponent);

    volumeService = TestBed.get(VolumeService);
    component = fixture.componentInstance;
  }));

  it('should send disk offerings when resizing data disks', () => {
    const newVolumeSize = 100;
    spyOn(volumeService, 'resize').and.callThrough();
    component.newSize = newVolumeSize;

    const diskOffering = new DiskOffering();
    diskOffering.id = 'diskOfferingId';
    component.diskOffering = diskOffering;

    component.resizeVolume();
    expect(volumeService.resize).toHaveBeenCalledWith({
      id: '1',
      size: newVolumeSize,
      diskOfferingId: diskOffering.id
    });
  });
});

