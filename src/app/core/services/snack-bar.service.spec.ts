import { CommonModule } from '@angular/common';

import { Component, Directive, NgModule, ViewChild, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { SnackBarService } from './snack-bar.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@Directive({ selector: '[csViewContainer]' })
class ViewContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'cs-test-component',
  template: `
    <div csViewContainer></div>`,
})
class TestComponent {
  @ViewChild(ViewContainerDirective)
  viewContainer: ViewContainerDirective;

  get childViewContainer() {
    return this.viewContainer.viewContainerRef;
  }
}

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  exports: [TestComponent, ViewContainerDirective],
  declarations: [TestComponent, ViewContainerDirective],
  entryComponents: [TestComponent],
})
class NotificationTestModule {}

describe('Service: Notification service', () => {
  let notificationService: SnackBarService;
  let mdSnackBar: MatSnackBar;
  let overlayContainerElement: HTMLElement;
  let viewContainerFixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NotificationTestModule, NoopAnimationsModule],
      providers: [
        SnackBarService,
        { provide: TranslateService, useClass: MockTranslateService },
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          },
        },
      ],
    });
  }));

  beforeEach(async(
    inject([SnackBarService, MatSnackBar], (service: SnackBarService, snackBar: MatSnackBar) => {
      notificationService = service;
      mdSnackBar = snackBar;
    }),
  ));

  afterEach(() => {
    overlayContainerElement.innerHTML = '';
    mdSnackBar = undefined;
    notificationService = undefined;
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(TestComponent);

    viewContainerFixture.detectChanges();
  });

  it('should be defined', () => {
    expect(SnackBarService).toBeDefined();
    expect(notificationService instanceof SnackBarService).toBeTruthy();
  });

  it('should call open method to show the SnackBar', () => {
    const testMessage = spyOn(mdSnackBar, 'open');
    notificationService.open('test').subscribe();
    expect(testMessage).toHaveBeenCalled();
  });

  it('should add the notification to the DOM', () => {
    expect(overlayContainerElement.querySelector('snack-bar-container')).toBeNull();

    notificationService.open('test').subscribe();
    expect(overlayContainerElement.querySelector('snack-bar-container')).not.toBeNull();
  });
});
