import { Injectable } from '@angular/core';
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

  constructor() {
    this.notifications = [];
    this.lastId = 0;
    this._pendingJobsCount = 0;
  }

  public get pendingJobsCount(): number {
    return this._pendingJobsCount;
  }

  public add(notification: INotification | string): string {
    console.log(notification);
    if (typeof notification === 'string') {
      const n: INotification = {
        id: '' + this.lastId++,
        message: notification,
        status: INotificationStatus.Pending
      };

      this.notifications.unshift(n);
      this._pendingJobsCount++;

      if (this.lastId >= Number.MAX_SAFE_INTEGER) {
        this.lastId = 0;
      }
      return '' + (this.lastId - 1);
    }

    const ind = this.notifications.findIndex((el: INotification) => el.id === notification.id);
    if (ind === -1) {
      notification.status = INotificationStatus.Pending;
      this.notifications.unshift(notification);
      this._pendingJobsCount++;
      return;
    }
    console.log(this.notifications);
    Object.assign(this.notifications[ind], notification);
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
