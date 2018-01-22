import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef, MatRadioModule
} from '@angular/material';
import { ConfigService } from '../../../services/config.service';
import { FormsModule } from '@angular/forms';
import { DiskOfferingDialogComponent } from './disk-offering-dialog.component';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DiskOffering } from '../../../models';

class MockConfigService {
  public get(key: string) {
    return ['created'];
  }
}

describe('Disk Offering dialog', () => {
  let fixture: ComponentFixture<DiskOfferingDialogComponent>;
  let component: DiskOfferingDialogComponent;
  let dialog: MatDialogRef<DiskOfferingDialogComponent>;

  const diskOffering =  {
    displaytext: 'test snapshot',
    id: 'test-id',
    disksize: 2,
    name: 'snapshot for testing',
    diskBytesReadRate: 1,
    diskBytesWriteRate: 2,
    diskIopsReadRate: 1,
    diskIopsWriteRate: 2,
    iscustomized: false,
    miniops: 1,
    maxiops: 1,
    storagetype: 'any',
    provisioningtype: 'any'
  };

  const diskOfferings: Array<DiskOffering> = [
   diskOffering
  ];

  beforeEach(
    async(() => {
      dialog = jasmine.createSpyObj('MdDialogRef', ['close']);

      TestBed.configureTestingModule({
        imports: [FormsModule, MatDialogModule, MatRadioModule],
        declarations: [MockTranslatePipe, DiskOfferingDialogComponent],
        providers: [
          { provide: ConfigService, useClass: MockConfigService },
          {
            provide: MatDialogRef,
            useValue: dialog
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: true },
          {
            provide: 'mockConfigServiceConfig',
            useValue: { value: {} }
          },
          {
            provide: 'mockResourceUsageServiceConfig',
            useValue: { value: {} }
          },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskOfferingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not return any data when `Cancel` is clicked', fakeAsync(() => {
    const noButton = fixture.debugElement.queryAll(By.css('button'))[0];
    noButton.nativeElement.click();

    fixture.detectChanges();
    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.close).toHaveBeenCalledWith('');
  }));

  it('should send disk offering', () => {
    component.selectedDiskOffering = diskOffering;
    component.onSubmit();
    expect(dialog.close).toHaveBeenCalledWith(diskOffering);
  });
});
