import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { JobsNotificationService } from '../../services/jobs-notification.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cs-notification-box',
  templateUrl: 'notification-box.component.html',
  styleUrls: ['notification-box.component.scss']
})
export class NotificationBoxComponent implements OnInit, OnDestroy {
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

  public removeCompleted(): void {
    this.jobsNotificationService.removeCompleted();
  }

  private resetCompletedNotificationCount() {
    this.jobsNotificationService.resetUnseenCompletedJobsCount();
  }
}
