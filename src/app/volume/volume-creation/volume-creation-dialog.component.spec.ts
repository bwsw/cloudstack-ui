import { MatDialogModule, MatDialogRef } from '@angular/material';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { VolumeCreationDialogComponent } from './volume-creation-dialog.component';
import { AuthService } from '../../shared/services/auth.service';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { DiskOffering, Zone } from '../../shared/models';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { MockAsyncJobService, MockStorageService, MockStore } from '../../shared/services/user.service.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { By } from '@angular/platform-browser';


@Component({
  selector: 'cs-test',
  template: `
    <cs-volume-creation-dialog
      [isLoading]="loading"
      [diskOfferings]="offerings"
      [maxSize]="maxSize"
      [zones]="zones"
      (onVolumeCreate)="createVolume($event)"
      (onZoneUpdated)="updateZone($event)"
    >
    </cs-volume-creation-dialog>
  `
})
class TestComponent {
  @ViewChild(VolumeCreationDialogComponent) public volumeCreationDialog: VolumeCreationDialogComponent;
  public loading: boolean;
  public diskOfferings: Array<DiskOffering>;
  public maxSize: number;
  public zones: Array<Zone>;
}


fdescribe('VolumeCreationDialogComponent', () => {
  let component: VolumeCreationDialogComponent;
  let fixture: ComponentFixture<VolumeCreationDialogComponent>;
  let dialog: MatDialogRef<VolumeCreationDialogComponent>;
  
  beforeEach(
    async(() => {
      dialog = jasmine.createSpyObj('MatDialogRef', ['close']);

      TestBed.configureTestingModule({
        imports: [FormsModule, MatDialogModule, HttpClientTestingModule],
        declarations: [MockTranslatePipe, TestComponent, VolumeCreationDialogComponent],
        providers: [
          { provide: MatDialogRef, useValue: dialog },
          { provide: AsyncJobService, useClass: MockAsyncJobService },
          { provide: LocalStorageService, useClass: MockStorageService },
          { provide: Store, useClass: MockStore },
          AuthService,
          JobsNotificationService
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not return any data when `No` is clicked', () => {
    const noButton = fixture.debugElement.queryAll(By.css('button'))[0];
    noButton.nativeElement.click();

    fixture.detectChanges();
    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.close).toHaveBeenCalledWith('');
  });

  it('should select a diskOffering', () => {
    const testDO = new DiskOffering({ id: '0' });
    const testDO1 = new DiskOffering({ id: '1' });
    component.diskOfferings = [testDO, testDO1];
    component.updateDiskOffering('1');

    fixture.detectChanges();
    expect(component.diskOffering.id).toEqual('1');
  });

  it('should emit a zoneId', () => {
    const testZone = {
      id: '1',
      name: 'test',
      securitygroupsenabled: true,
      networktype: 'any',
      localstorageenabled: true
    };
    component.zones = [testZone];
    const spyEmit = spyOn(component.onZoneUpdated,  'emit');
    component.updateZone('1');

    fixture.detectChanges();
    expect(spyEmit).toHaveBeenCalledWith(testZone);
  });
});
