import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { JobsNotificationService } from '../../services/jobs-notification.service';
import { PopoverTriggerDirective } from '../popover/popover-trigger.directive';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cs-notification-box',
  templateUrl: 'notification-box.component.html',
  styleUrls: ['notification-box.component.scss']
})
export class NotificationBoxComponent implements OnInit, OnDestroy {
  @ViewChild(PopoverTriggerDirective) public popover: PopoverTriggerDirective;
  public notificationCount$: Observable<number>;
  private isOpen = false;
  private autoResetCompletedNotification: Subscription;

  constructor(public jobsNotificationService: JobsNotificationService) {
  }

  public ngOnInit(): void {
    this.notificationCount$ = Observable.combineLatest(
      this.jobsNotificationService.unseenCompletedJobsCount$,
      this.jobsNotificationService.pendingJobsCount$,
      (unseenCount, pendingCount) => unseenCount + pendingCount
    );

    this.autoResetCompletedNotification = this.jobsNotificationService.unseenCompletedJobsCount$
      .filter(count => count > 0 && this.isOpen)
      .delay(1)
      .do(() => this.resetCompletedNotificationCount()).subscribe()
  }

  public ngOnDestroy() {
    this.autoResetCompletedNotification.unsubscribe();
  }

  public onOpen(): void {
    this.resetCompletedNotificationCount();
    this.isOpen = true;
  }

  public onClose(): void {
    this.isOpen = false;
  }

  public onCloseJobNotification(id: string): void {
    this.jobsNotificationService.pendingJobsCount$.first().subscribe(pendingJobsCount => {
      const notificationsCount = this.jobsNotificationService.notifications.length;
      if (pendingJobsCount === 0 && notificationsCount === 1) {
        this.popover.closePopover();
      }
    });

    this.jobsNotificationService.remove(id);
  }

  public removeCompleted(): void {
    this.jobsNotificationService.removeCompleted();
    this.popover.closePopover();
  }

  private resetCompletedNotificationCount() {
    this.jobsNotificationService.resetUnseenCompletedJobsCount();
  }
}
