import { Injectable, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { OverlayLoadingComponent } from '../../../components/overlay-loading/overlay-loading.component';
import { SliderComponent } from '../../../components/slider/slider.component';
import { DiskOffering, Volume } from '../../../models';
import { StorageTypes } from '../../../models/offering.model';
import { VolumeType } from '../../../models/volume.model';
import { DiskOfferingService } from '../../../services/disk-offering.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { ResourceUsageService } from '../../../services/resource-usage.service';
import { VolumeResizeComponent } from './volume-resize.component';


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
  public transform(): number | string {
    return 0;
  }
}

describe('volume resize for root disks', () => {
  let component: VolumeResizeComponent;

  beforeEach(async(() => {
    let fixture;

    const dialog = jasmine.createSpyObj('MdDialogRef', ['close']);
    const dialogService = jasmine.createSpyObj('DialogService', ['alert']);
    const jobsNotificationService = jasmine.createSpyObj(
      'JobsNotificationService',
      ['add', 'finish', 'fail']
    );

    const testVolume = new Volume('');
    testVolume.id = '1';
    testVolume.size = 1;
    testVolume.type = VolumeType.ROOT;

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
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
        { provide: MatDialogRef, useValue: dialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed
      .overrideComponent(OverlayLoadingComponent, { set: { template: '' } })
      .overrideComponent(SliderComponent, { set: { template: '' } })
      .createComponent(VolumeResizeComponent);

    component = fixture.componentInstance;
    component.volume = testVolume;
  }));

  it('should not send disk offerings when resizing root disks', () => {
    const newVolumeSize = 100;
    component.newSize = newVolumeSize;
    spyOn(component.onDiskResized, 'emit').and.callThrough();

    const diskOffering: DiskOffering = {
      disksize: 1,
      id: 'diskOfferingId',
      name: 'Disk Offering',
      displaytext: 'About disk offering',
      diskBytesReadRate: 1,
      diskBytesWriteRate: 1,
      diskIopsReadRate: 1,
      diskIopsWriteRate: 1,
      iscustomized: true,
      miniops: 1,
      maxiops: 1,
      storagetype: StorageTypes.local,
      provisioningtype: '',
    };
    diskOffering.id = 'diskOfferingId';
    component.diskOfferingId = diskOffering.id;

    component.resizeVolume();
    expect(component.onDiskResized.emit).toHaveBeenCalledWith({
      id: '1',
      size: newVolumeSize
    });
  });
});

describe('volume resize for data disks', () => {
  let component: VolumeResizeComponent;

  beforeEach(async(() => {
    let fixture;

    const dialog = jasmine.createSpyObj('MdDialogRef', ['close']);
    const dialogService = jasmine.createSpyObj('DialogService', ['alert']);
    const jobsNotificationService = jasmine.createSpyObj(
      'JobsNotificationService',
      ['add', 'finish', 'fail']
    );

    const testVolume = new Volume('');
    testVolume.id = '1';
    testVolume.size = 1;
    testVolume.type = VolumeType.DATADISK;

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
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
        { provide: MatDialogRef, useValue: dialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed
      .overrideComponent(OverlayLoadingComponent, { set: { template: '' } })
      .overrideComponent(SliderComponent, { set: { template: '' } })
      .createComponent(VolumeResizeComponent);

    component = fixture.componentInstance;
    component.volume = testVolume;
  }));

  it('should send disk offerings when resizing data disks', () => {
    const newVolumeSize = 100;
    component.newSize = newVolumeSize;
    spyOn(component.onDiskResized, 'emit').and.callThrough();

    const diskOffering = {
      disksize: 1,
      id: 'diskOfferingId',
      name: 'Disk Offering',
      displaytext: 'About disk offering',
      diskBytesReadRate: 1,
      diskBytesWriteRate: 1,
      diskIopsReadRate: 1,
      diskIopsWriteRate: 1,
      iscustomized: true,
      miniops: 1,
      maxiops: 1,
      storagetype: StorageTypes.local,
      provisioningtype: '',
    }
    component.diskOfferingId = diskOffering.id;

    component.resizeVolume();
    expect(component.onDiskResized.emit).toHaveBeenCalledWith({
      id: '1',
      size: newVolumeSize,
      diskOfferingId: component.diskOfferingId
    });
  });
});

