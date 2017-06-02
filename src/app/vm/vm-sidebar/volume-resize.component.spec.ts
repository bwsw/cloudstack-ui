import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { DiskOfferingComponent } from '../../shared/components/disk-offering/disk-offering.component';
import { OverlayLoadingComponent } from '../../shared/components/overlay-loading/overlay-loading.component';
import { SliderComponent } from '../../shared/components/slider/slider.component';
import { DiskStorageService } from '../../shared/index';
import { DiskOffering, Volume } from '../../shared/models';
import { JobsNotificationService } from '../../shared/services';
import { VolumeService } from '../../shared/services/volume.service';
import { VolumeResizeComponent } from './volume-resize.component';


@Injectable()
class MockDiskStorageService {
  public availableStorage = 1000000;

  public getAvailablePrimaryStorage(): Observable<number> {
    return Observable.of(this.availableStorage);
  }
}

@Injectable()
class MockVolumeService {
  public resize(): Observable<Volume> {
    return Observable.of(new Volume(''));
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

    const dialog = jasmine.createSpyObj('MdlDialogReference', ['hide']);
    const dialogService = jasmine.createSpyObj('DialogService', ['alert']);
    const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', ['add', 'finish', 'fail']);

    const testVolume = new Volume('');
    testVolume.id = '1';
    testVolume.size = 1;
    testVolume.type = 'ROOT';

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
        { provide: DiskStorageService, useClass: MockDiskStorageService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: MdlDialogReference, useValue: dialog },
        { provide: VolumeService, useClass: MockVolumeService },
        { provide: 'volume', useValue: testVolume }
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

    let diskOffering = new DiskOffering();
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

    const dialog = jasmine.createSpyObj('MdlDialogReference', ['hide']);
    const dialogService = jasmine.createSpyObj('DialogService', ['alert']);
    const jobsNotificationService = jasmine.createSpyObj('JobsNotificationService', ['add', 'finish', 'fail']);

    const testVolume = new Volume('');
    testVolume.id = '1';
    testVolume.size = 1;
    testVolume.type = 'DATADISK';

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
        { provide: DiskStorageService, useClass: MockDiskStorageService },
        { provide: JobsNotificationService, useValue: jobsNotificationService },
        { provide: MdlDialogReference, useValue: dialog },
        { provide: VolumeService, useClass: MockVolumeService },
        { provide: 'volume', useValue: testVolume }
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

    let diskOffering = new DiskOffering();
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

