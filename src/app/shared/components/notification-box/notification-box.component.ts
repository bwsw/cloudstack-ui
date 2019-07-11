import { Component, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs';
import { delay, filter, map, tap } from 'rxjs/operators';
import {
  INotificationStatus,
  JobsNotificationService,
} from '../../services/jobs-notification.service';

@Component({
  selector: 'cs-notification-box',
  templateUrl: 'notification-box.component.html',
  styleUrls: ['notification-box.component.scss'],
})
export class NotificationBoxComponent implements OnDestroy {
  readonly notificationCount$ = combineLatest(
    this.jobsNotificationService.unseenCompletedJobsCount$,
    this.jobsNotificationService.pendingJobsCount$,
  ).pipe(map(([unseenCount, pendingCount]) => unseenCount + pendingCount));
  readonly hideNotifications$ = this.notificationCount$.pipe(map(count => count === 0));

  public notificationStatus = INotificationStatus;
  private isOpen = false;
  private autoResetCompletedNotification = this.jobsNotificationService.unseenCompletedJobsCount$
    .pipe(
      filter(count => count > 0 && this.isOpen),
      delay(1),
      tap(() => this.resetCompletedNotificationCount()),
    )
    .subscribe();

  constructor(public jobsNotificationService: JobsNotificationService) {}

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

  public removeCompleted(): void {
    this.jobsNotificationService.removeCompleted();
  }

  private resetCompletedNotificationCount() {
    this.jobsNotificationService.resetUnseenCompletedJobsCount();
  }
}
