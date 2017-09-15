import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { JobsNotificationService } from '../../services/jobs-notification.service';
import { PopoverTriggerDirective } from '../popover/popover-trigger.directive';

@Component({
  selector: 'cs-notification-box',
  templateUrl: 'notification-box.component.html',
  styleUrls: ['notification-box.component.scss']
})
export class NotificationBoxComponent implements OnInit, OnDestroy {
  public unseenCount = 0;
  @ViewChild(PopoverTriggerDirective) public popover: PopoverTriggerDirective;

  private unseenCountStream: Subscription;

  constructor(public jobsNotificationService: JobsNotificationService) {}

  public ngOnInit(): void {
    this.unseenCountStream = this.jobsNotificationService.unseenJobs.subscribe(
      count => (this.unseenCount += count)
    );
  }

  public ngOnDestroy(): void {
    this.unseenCountStream.unsubscribe();
  }

  public onToggle(): void {
    this.unseenCount = this.jobsNotificationService.pendingJobsCount;
  }

  public close(id: string): void {
    const pendingJobsCount = this.jobsNotificationService.pendingJobsCount;
    const notificationsCount = this.jobsNotificationService.notifications.length;
    if (pendingJobsCount === 0 && notificationsCount === 1) {
      this.popover.closePopover();
    }

    this.jobsNotificationService.remove(id);
  }

  public removeCompleted(): void {
    this.jobsNotificationService.removeCompleted();
    this.unseenCount = 0;
    this.popover.closePopover();
  }
}
