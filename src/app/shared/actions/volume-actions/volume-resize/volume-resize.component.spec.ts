import { Injectable, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable, of, Subject } from 'rxjs';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { OverlayLoadingComponent } from '../../../components/overlay-loading/overlay-loading.component';
import { SliderComponent } from '../../../components/slider/slider.component';
import { DiskOffering, Volume } from '../../../models';
import { storageTypes } from '../../../models/offering.model';
import { VolumeType } from '../../../models/volume.model';
import { DiskOfferingService } from '../../../services/disk-offering.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { ResourceUsageService } from '../../../services/resource-usage.service';
import { VolumeResizeComponent } from './volume-resize.component';
import { AuthService } from '../../../services/auth.service';

@Injectable()
class MockResourceUsageService {
  public availableStorage = 1000000;

  public getResourceUsage(): Observable<any> {
    return of({
      available: {
        primaryStorage: this.availableStorage,
      },
    });
  }
}

@Injectable()
class MockDiskOfferingService {
  public get(): Observable<any> {
    return of([]);
  }
}

@Injectable()
export class MockAuthService {
  public loggedIn = new Subject<boolean>();
}

@Pipe({
  // tslint:disable-next-line
  name: 'division',
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
    const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', [
      'add',
      'finish',
      'fail',
    ]);

    const testVolume = {} as Volume;
    testVolume.id = '1';
    testVolume.size = 1;
    testVolume.type = VolumeType.ROOT;

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        OverlayLoadingComponent,
        MockDivisionPipe,
        MockTranslatePipe,
        SliderComponent,
        VolumeResizeComponent,
      ],
      providers: [
        { provide: DialogService, useValue: dialogService },
        { provide: AuthService, useValue: MockAuthService },
        { provide: DiskOfferingService, useClass: MockDiskOfferingService },
        { provide: ResourceUsageService, useClass: MockResourceUsageService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: MatDialogRef, useValue: dialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.overrideComponent(OverlayLoadingComponent, { set: { template: '' } })
      .overrideComponent(SliderComponent, { set: { template: '' } })
      .createComponent(VolumeResizeComponent);

    component = fixture.componentInstance;
    component.volume = testVolume;
  }));

  it('should not send disk offerings when resizing root disks', () => {
    const newVolumeSize = 100;
    component.newSize = newVolumeSize;
    spyOn(component.diskResized, 'emit').and.callThrough();

    const diskOffering: DiskOffering = {
      disksize: 1,
      id: 'diskofferingid',
      name: 'Disk Offering',
      displaytext: 'About disk offering',
      diskBytesReadRate: 1,
      diskBytesWriteRate: 1,
      diskIopsReadRate: 1,
      diskIopsWriteRate: 1,
      iscustomized: true,
      miniops: 1,
      maxiops: 1,
      storagetype: storageTypes.local,
      provisioningtype: '',
    };
    diskOffering.id = 'diskofferingid';
    component.diskOffering = diskOffering;

    component.resizeVolume();
    expect(component.diskResized.emit).toHaveBeenCalledWith({
      id: '1',
      size: newVolumeSize,
    });
  });
});

describe('volume resize for data disks', () => {
  let component: VolumeResizeComponent;

  beforeEach(async(() => {
    let fixture;

    const dialog = jasmine.createSpyObj('MdDialogRef', ['close']);
    const dialogService = jasmine.createSpyObj('DialogService', ['alert']);
    const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', [
      'add',
      'finish',
      'fail',
    ]);

    const testVolume = {} as Volume;
    testVolume.id = '1';
    testVolume.size = 1;
    testVolume.type = VolumeType.DATADISK;

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        OverlayLoadingComponent,
        MockDivisionPipe,
        MockTranslatePipe,
        SliderComponent,
        VolumeResizeComponent,
      ],
      providers: [
        { provide: DialogService, useValue: dialogService },
        { provide: AuthService, useValue: MockAuthService },
        { provide: DiskOfferingService, useClass: MockDiskOfferingService },
        { provide: ResourceUsageService, useClass: MockResourceUsageService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: MatDialogRef, useValue: dialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.overrideComponent(OverlayLoadingComponent, { set: { template: '' } })
      .overrideComponent(SliderComponent, { set: { template: '' } })
      .createComponent(VolumeResizeComponent);

    component = fixture.componentInstance;
    component.volume = testVolume;
  }));

  it('should send disk offerings when resizing data disks', () => {
    const newVolumeSize = 100;
    component.newSize = newVolumeSize;
    spyOn(component.diskResized, 'emit').and.callThrough();

    const diskOffering = {
      disksize: 1,
      id: 'diskofferingid',
      name: 'Disk Offering',
      displaytext: 'About disk offering',
      diskBytesReadRate: 1,
      diskBytesWriteRate: 1,
      diskIopsReadRate: 1,
      diskIopsWriteRate: 1,
      iscustomized: true,
      miniops: 1,
      maxiops: 1,
      storagetype: storageTypes.local,
      provisioningtype: '',
    };
    component.diskOffering = diskOffering;

    component.resizeVolume();
    expect(component.diskResized.emit).toHaveBeenCalledWith({
      id: '1',
      size: newVolumeSize,
      diskofferingid: component.diskOffering.id,
    });
  });
});
