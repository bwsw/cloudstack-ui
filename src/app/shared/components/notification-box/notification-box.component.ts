import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { delay, filter, map, tap } from 'rxjs/operators';
import { SidebarWidthService } from '../../../core/services';
import { JobsNotificationService } from '../../services/jobs-notification.service';

@Component({
  selector: 'cs-notification-box',
  templateUrl: 'notification-box.component.html',
  styleUrls: ['notification-box.component.scss'],
})
export class NotificationBoxComponent implements OnInit, OnDestroy {
  @HostBinding('style.right.px')
  public rightIndent;
  public notificationCount$: Observable<number>;
  private isOpen = false;
  private autoResetCompletedNotification: Subscription;

  constructor(
    public jobsNotificationService: JobsNotificationService,
    private sidebarWidthService: SidebarWidthService,
  ) {}

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

    this.sidebarWidthService.width.subscribe(width => (this.rightIndent = width));
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
