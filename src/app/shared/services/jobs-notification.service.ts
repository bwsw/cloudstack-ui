import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum INotificationStatus {
  Pending,
  Finished,
  Failed
}

export interface INotification {
  id?: string;
  message?: string;
  status?: INotificationStatus;
}

@Injectable()
export class JobsNotificationService {
  public notifications: Array<INotification>;
  private lastId: number;
  private _pendingJobsCount: number;
  private _unseenJobs: Subject<number>;

  constructor() {
    this.notifications = [];
    this.lastId = 0;
    this._pendingJobsCount = 0;
    this._unseenJobs = new Subject<number>();
  }

  public get pendingJobsCount(): number {
    return this._pendingJobsCount;
  }

  public get unseenJobs(): Observable<number> {
    return this._unseenJobs.asObservable();
  }

  public add(notification: INotification | string): string {
    if (typeof notification === 'string') {
      const n: INotification = {
        id: (this.lastId++).toString(),
        message: notification,
        status: INotificationStatus.Pending
      };

      this.notifications.unshift(n);
      this._pendingJobsCount++;
      this._unseenJobs.next(1);

      if (this.lastId >= Number.MAX_SAFE_INTEGER) {
        this.lastId = 0;
      }
      return (this.lastId - 1).toString();
    }

    if (!notification.id) {
      notification.id = (this.lastId).toString();
    }

    const ind = this.notifications.findIndex((el: INotification) => el.id === notification.id);
    if (ind === -1) {
      // vvv relies on Pending being 0 (1st field in enum) vvv
      notification.status = notification.status || INotificationStatus.Pending;
      this.notifications.unshift(notification);
      this._pendingJobsCount++;
      this._unseenJobs.next(1);
      return notification.id;
    }
    Object.assign(this.notifications[ind], notification);
    this.updateUnseenCount();
    return notification.id;
  }

  public remove(id: string): void {
    const ind = this.notifications.findIndex((el: INotification) => el.id === id);
    if (ind === -1 ) {
      return;
    }

    if (this.notifications[ind].status === INotificationStatus.Pending) {
      return;
    }

    this.notifications.splice(ind, 1);
  }

  public removeAll() {
    this.notifications = this.notifications.filter((n: INotification) => n.status === INotificationStatus.Pending);
  }

  public updateUnseenCount(): void {
    let pendingCount = 0;
    this.notifications.forEach((n: INotification) => {
      if (n.status === INotificationStatus.Pending) {
        pendingCount++;
      }
    });

    this._pendingJobsCount = pendingCount;
  }
}
