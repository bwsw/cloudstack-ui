import { Component, DebugElement, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockDirective } from 'ng-mocks';
import { NEVER, of } from 'rxjs';
import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { LoadingDirective } from '../../../shared/directives';
import { VmSnapshot } from '../../../shared/models/vm-snapshot.model';
import { VmSnapshotService } from '../../../shared/services/vm-snapshot.service';

import {
  VmSnapshotsCheckerDialogComponent,
  VmSnapshotsCheckerDialogData,
} from './vm-snapshots-checker-dialog.component';

describe('VmSnapshotsCheckerDialogComponent', () => {
  let component: VmSnapshotsCheckerDialogComponent;
  let fixture: ComponentFixture<VmSnapshotsCheckerDialogComponent>;

  const mockMatDialogClose = MockDirective(MatDialogClose);

  const vm = require('../../../../testutils/mocks/model-services/fixtures/vms.json')[0];
  const snapshots = require('../../../../testutils/mocks/model-services/fixtures/snapshots.json');

  let snapshotService;

  @Component({
    template: `
      component outlet content
    `,
  })
  class TestComponent {}

  beforeEach(async(() => {
    snapshotService = {
      getList: jasmine.createSpy().and.returnValue(of(NEVER)),
    };

    @NgModule({
      declarations: [LoaderComponent, TestComponent],
      entryComponents: [LoaderComponent, TestComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    class TestModule {}

    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [
        VmSnapshotsCheckerDialogComponent,
        MockTranslatePipe,
        LoadingDirective,
        mockMatDialogClose,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            vm,
            component: TestComponent,
            noticeMessageId: 'MESSAGE_ID',
          } as VmSnapshotsCheckerDialogData,
        },
        {
          provide: VmSnapshotService,
          useValue: snapshotService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmSnapshotsCheckerDialogComponent);
    component = fixture.componentInstance;
  });

  function hasSpinner() {
    return !!fixture.nativeElement.querySelector('mat-spinner');
  }

  function hasContent() {
    return !!findContent();
  }

  function findContent(): HTMLElement {
    return fixture.nativeElement.querySelector('.mat-dialog-content');
  }

  function setReturnedSnapshots(snaps: VmSnapshot[]) {
    snapshotService.getList.and.returnValue(of(snaps));
  }

  it('should show a spinner when snapshots are not fetched', () => {
    fixture.detectChanges();
    expect(snapshotService.getList).toHaveBeenCalledWith({ virtualmachineid: vm.id });
    expect(hasSpinner()).toBe(true);
    expect(hasContent()).toBe(false);
  });

  function findButtonEls(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('.mat-dialog-actions button'));
  }

  describe('no snapshots', () => {
    beforeEach(() => {
      setReturnedSnapshots([]);
      fixture.detectChanges();
    });

    it('should display supplied component', () => {
      expect(fixture.nativeElement.textContent.trim()).toBe('component outlet content');
    });
  });

  describe('has snapshots', () => {
    beforeEach(() => {
      setReturnedSnapshots(snapshots);
      fixture.detectChanges();
    });

    it('should display snapshots notice', () => {
      expect(findContent().textContent.trim()).toBe('MESSAGE_ID');
    });

    it('should display dismiss button', () => {
      const buttonEls = findButtonEls();
      expect(buttonEls.length).toBe(1);
      expect(buttonEls[0].nativeElement.textContent).toContain('COMMON.OK');
      expect(buttonEls[0].injector.get(mockMatDialogClose)._matDialogClose).toBe('');
    });
  });
});
