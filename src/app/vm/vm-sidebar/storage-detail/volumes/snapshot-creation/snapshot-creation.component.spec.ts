import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockDirective, MockedDirective } from 'ng-mocks';
import { NEVER, of } from 'rxjs';
import { MockTranslatePipe } from '../../../../../../testutils/mocks/mock-translate.pipe.spec';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { LoadingDirective } from '../../../../../shared/directives';
import { ResourceUsageService } from '../../../../../shared/services/resource-usage.service';
import { SnapshotCreationComponent } from './snapshot-creation.component';

describe('SnapshotCreationComponent', () => {
  let component: SnapshotCreationComponent;
  let fixture: ComponentFixture<SnapshotCreationComponent>;

  const mockDialogClose = MockDirective(MatDialogClose);

  let dialogRef;
  let resourceUsageService;

  @NgModule({
    declarations: [LoadingDirective, LoaderComponent],
    entryComponents: [LoaderComponent],
    exports: [LoadingDirective],
    schemas: [NO_ERRORS_SCHEMA],
  })
  class TestModule {}

  beforeEach(async(() => {
    dialogRef = {
      close: jasmine.createSpy(),
    };

    resourceUsageService = {
      getResourceUsage: jasmine.createSpy().and.returnValue(NEVER),
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, TestModule],
      declarations: [SnapshotCreationComponent, MockTranslatePipe, mockDialogClose],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
        {
          provide: ResourceUsageService,
          useValue: resourceUsageService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotCreationComponent);
    component = fixture.componentInstance;
  });

  function hasSpinner() {
    return !!fixture.nativeElement.querySelector('mat-spinner');
  }

  function findContent(): HTMLElement {
    return fixture.nativeElement.querySelector('.mat-dialog-content');
  }

  it('should show a spinner when resource usage data is not ready', () => {
    fixture.detectChanges();
    expect(resourceUsageService.getResourceUsage).toHaveBeenCalled();
    expect(component.loading).toBe(true);
    expect(hasSpinner()).toBe(true);
    expect(findContent()).toBeNull();
  });

  function findCancelButton(): HTMLElement {
    return fixture.nativeElement.querySelector('button[type="button"]');
  }

  function findSubmitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[type="submit"]');
  }

  function findDialogClose(): MockedDirective<MatDialogClose>[] {
    return fixture.debugElement
      .queryAll(By.css('button'))
      .map(el => el.injector.get(mockDialogClose));
  }

  describe('not enough resources', () => {
    beforeEach(() => {
      resourceUsageService.getResourceUsage.and.returnValue(
        of({
          available: {
            snapshots: 0,
          },
        }),
      );

      fixture.detectChanges();
    });

    it('should not show spinners', () => {
      expect(component.loading).toBe(false);
      expect(hasSpinner()).toBe(false);
      expect(findContent()).not.toBeNull();
    });

    it('should show resources notice', () => {
      expect(findContent().textContent.trim()).toBe('ERRORS.SNAPSHOT.LIMIT_EXCEEDED');
    });

    it('should have only cancel button', () => {
      expect(findCancelButton()).not.toBeNull();
      expect(findSubmitButton()).toBeNull();

      expect(findDialogClose()[0]._matDialogClose).toBeFalsy();
    });
  });

  describe('enough resources', () => {
    function findNameInput(): HTMLInputElement {
      return fixture.nativeElement.querySelector('input[name="name"]');
    }

    async function enterInputValue(input: HTMLInputElement, value: string) {
      input.value = value;
      input.dispatchEvent(new UIEvent('input'));

      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();
    }

    async function enterName(value: string) {
      return enterInputValue(findNameInput(), value);
    }

    async function enterDescription(value: string) {
      return enterInputValue(
        fixture.nativeElement.querySelector('input[name="description"]'),
        value,
      );
    }

    beforeEach(() => {
      resourceUsageService.getResourceUsage.and.returnValue(
        of({
          available: {
            snapshots: 1,
          },
        }),
      );

      fixture.detectChanges();
    });

    it('should have cancel and submit button', () => {
      expect(findCancelButton()).not.toBeNull();
      expect(findSubmitButton()).not.toBeNull();
    });

    it('should `name` prefilled with a default value', async () => {
      await fixture.whenStable();
      expect(findNameInput().value).not.toBeFalsy();
    });

    it('should require `name` field', async () => {
      await fixture.whenStable();

      await enterName('name');
      expect(findSubmitButton().disabled).toBe(false);
      await enterName('');
      expect(findSubmitButton().disabled).toBe(true);
    });

    it('should close the dialog with collected data on submit', async () => {
      await fixture.whenStable();

      const name = 'name';
      const description = 'description';

      await enterName(name);
      await enterDescription(description);

      findSubmitButton().click();
      expect(dialogRef.close).toHaveBeenCalledWith({
        name,
        desc: description,
      });
    });
  });
});
