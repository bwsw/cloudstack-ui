import { DebugElement, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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

import { VmRestoreDialogComponent } from './vm-restore-dialog.component';

describe('VmRestoreDialogComponent', () => {
  let component: VmRestoreDialogComponent;
  let fixture: ComponentFixture<VmRestoreDialogComponent>;

  const mockMatDialogClose = MockDirective(MatDialogClose);

  const vm = require('../../../../testutils/mocks/model-services/fixtures/vms.json')[0];
  const snapshots = require('../../../../testutils/mocks/model-services/fixtures/snapshots.json');

  let snapshotService;

  beforeEach(async(() => {
    snapshotService = {
      getList: jasmine.createSpy().and.returnValue(of(NEVER)),
    };

    @NgModule({
      declarations: [LoaderComponent],
      entryComponents: [LoaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    class TestModule {}

    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [
        VmRestoreDialogComponent,
        MockTranslatePipe,
        LoadingDirective,
        mockMatDialogClose,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { vm },
        },
        {
          provide: VmSnapshotService,
          useValue: snapshotService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  function hasLoading() {
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

  beforeEach(() => {
    fixture = TestBed.createComponent(VmRestoreDialogComponent);
    component = fixture.componentInstance;
  });

  it('should a loading when snapshots are not fetched', () => {
    fixture.detectChanges();
    expect(snapshotService.getList).toHaveBeenCalledWith({ virtualmachineid: vm.id });
    expect(hasLoading()).toBe(true);
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

    it('should display reinstall confirmation', () => {
      expect(findContent().textContent.trim()).toBe('DIALOG_MESSAGES.VM.CONFIRM_RESTORE');
    });

    it('should display confirmation actions', () => {
      const buttonEls = findButtonEls();
      expect(buttonEls.length).toBe(2);
      expect(buttonEls[0].nativeElement.textContent).toContain('COMMON.NO');
      expect(buttonEls[1].nativeElement.textContent).toContain('COMMON.YES');

      const dialogCloseResults = buttonEls.map(
        el => el.injector.get(mockMatDialogClose)._matDialogClose,
      );
      expect(dialogCloseResults[0]).toBe('');
      expect(dialogCloseResults[1]).toBe(true);
    });
  });

  describe('has snapshots', () => {
    beforeEach(() => {
      setReturnedSnapshots(snapshots);
      fixture.detectChanges();
    });

    it('should display snapshots notice', () => {
      expect(findContent().textContent.trim()).toBe('DIALOG_MESSAGES.VM.REMOVE_SNAPSHOTS');
    });

    it('should display dismiss button', () => {
      const buttonEls = findButtonEls();
      expect(buttonEls.length).toBe(1);
      expect(buttonEls[0].nativeElement.textContent).toContain('COMMON.OK');
      expect(buttonEls[0].injector.get(mockMatDialogClose)._matDialogClose).toBe('');
    });
  });
});
