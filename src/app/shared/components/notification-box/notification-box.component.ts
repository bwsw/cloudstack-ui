import { combineLatest, Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, filter, map, tap } from 'rxjs/operators';

import { JobsNotificationService } from '../../services/jobs-notification.service';

@Component({
  selector: 'cs-notification-box',
  templateUrl: 'notification-box.component.html',
  styleUrls: ['notification-box.component.scss'],
})
export class NotificationBoxComponent implements OnInit, OnDestroy {
  public notificationCount$: Observable<number>;
  private isOpen = false;
  private autoResetCompletedNotification: Subscription;

  constructor(public jobsNotificationService: JobsNotificationService) {}

  public ngOnInit(): void {
    this.notificationCount$ = combineLatest(
      this.jobsNotificationService.unseenCompletedJobsCount$,
      this.jobsNotificationService.pendingJobsCount$,
    ).pipe(map(([unseenCount, pendingCount]) => unseenCount + pendingCount));

    this.autoResetCompletedNotification = this.jobsNotificationService.unseenCompletedJobsCount$
      .pipe(
        filter(count => count > 0 && this.isOpen),
        delay(1),
        tap(() => this.resetCompletedNotificationCount()),
      )
      .subscribe();
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

  public removeCompleted(): void {
    this.jobsNotificationService.removeCompleted();
  }

  private resetCompletedNotificationCount() {
    this.jobsNotificationService.resetUnseenCompletedJobsCount();
  }
}
