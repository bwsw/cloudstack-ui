import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.mock';
import { NotificationService } from './notification.service';
import { MdSnackBar, MdSnackBarModule, OverlayContainer } from '@angular/material';

import {
  Component,
  Directive,
  NgModule,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Service: Notification service', () => {
  let notificationService: NotificationService;
  let mdSnackBar: MdSnackBar;
  let liveAnnouncer: LiveAnnouncer;
  let overlayContainerElement: HTMLElement;
  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdSnackBarModule, NotificationTestModule, NoopAnimationsModule],
      providers: [
        NotificationService,
        { provide: TranslateService, useClass: MockTranslateService },
        {
          provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return { getContainerElement: () => overlayContainerElement };
        }
        }
      ]
    });
  }));

  beforeEach(async(inject(
    [NotificationService, MdSnackBar, LiveAnnouncer],
    (
      service: NotificationService,
      snackBar: MdSnackBar,
      lAnnouncer: LiveAnnouncer
    ) => {
      notificationService = service;
      mdSnackBar = snackBar;
      liveAnnouncer = lAnnouncer;
    }
    ))
  );

  afterEach(() => {
    overlayContainerElement.innerHTML = '';
    liveAnnouncer = undefined;
    mdSnackBar = undefined;
    notificationService = undefined;
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(TestComponent);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should be defined', () => {
    expect(NotificationService).toBeDefined();
    expect(notificationService instanceof NotificationService).toBeTruthy();
  });

  it('should call MdSnackBar method to show the notification', () => {
    const testMessage = spyOn(mdSnackBar, 'open');
    notificationService.message('test');
    expect(testMessage).toHaveBeenCalled();
  });

  it('should support 3 types of notifications', () => {
    const testNotification = spyOn(mdSnackBar, 'open');
    notificationService.message('test');
    notificationService.warning('test', 'test');
    notificationService.error('test');
    expect(testNotification).toHaveBeenCalledTimes(3);
  });

  it('should add the notification to the DOM', () => {


    Object.assign(
      notificationService.snackBarConfig,
      { viewContainerRef: testViewContainerRef }
    );

    expect(overlayContainerElement.querySelector('snack-bar-container')).toBeNull();

    notificationService.message('test');
    expect(overlayContainerElement.querySelector('snack-bar-container')).not.toBeNull();
  });
});

@Directive({ selector: '[csViewContainer]' })
class ViewContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'cs-test-component',
  template: `
    <div csViewContainer></div>`,
})
class TestComponent {
  @ViewChild(ViewContainerDirective) viewContainer: ViewContainerDirective;

  get childViewContainer() {
    return this.viewContainer.viewContainerRef;
  }
}

@NgModule({
  imports: [CommonModule, MdSnackBarModule],
  exports: [TestComponent, ViewContainerDirective],
  declarations: [TestComponent, ViewContainerDirective],
  entryComponents: [TestComponent],
})
class NotificationTestModule {
}

