import { Component, ViewChild } from '@angular/core';
import { JobsNotificationService } from './shared/services/jobs-notification.service';
import { MdlPopoverComponent } from '@angular2-mdl-ext/popover';

@Component({
  selector: 'cs-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.scss']
})
export class NotificationBoxComponent {
  @ViewChild(MdlPopoverComponent)
  private popover: MdlPopoverComponent;

  constructor(private jobsNotificationService: JobsNotificationService) { }

  public onToggle(e: Event) {
    if (this.popover.isVisible) {
      this.jobsNotificationService.updateUnseenCount();
    }
  }
  public close(id: string) {
    // if you call .remove() as is, popup closes for no reason
    setTimeout(() => this.jobsNotificationService.remove(id));
  }

  public removeAll() {
    this.jobsNotificationService.removeAll();
  }
}
