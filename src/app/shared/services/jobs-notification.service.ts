import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Utils } from './utils/utils.service';


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
  private _pendingJobsCount: number;
  private _unseenJobsCount$: BehaviorSubject<number>;

  constructor() {
    this._unseenJobsCount$ = new BehaviorSubject<number>(0);
  }

  public get pendingJobsCount(): number {
    return this._pendingJobsCount;
  }

  public get unseenJobsCount$(): Observable<number> {
    return this._unseenJobsCount$.asObservable();
  }

  public add(notification: INotification | string): string {
    if (typeof notification === 'string') {
      const id = Utils.getUniqueId();
      const n: INotification = {
        id,
        message: notification,
        status: INotificationStatus.Pending
      };

      this.notifications.unshift(n);
      this._pendingJobsCount++;
      this.incrementUnseenJobsCount();

      return id;
    }

    if (!notification.id) {
      notification.id = Utils.getUniqueId();
    }

    const ind = this.notifications.findIndex((el: INotification) => el.id === notification.id);
    if (ind === -1) {
      // vvv relies on Pending being 0 (1st field in enum) vvv
      notification.status = notification.status || INotificationStatus.Pending;
      this.notifications.unshift(notification);
      if (notification.status === INotificationStatus.Pending) {
        this._pendingJobsCount++;
      }
      this.incrementUnseenJobsCount();

      return notification.id;
    }
    Object.assign(this.notifications[ind], notification);
    this._pendingJobsCount--;
    return notification.id;
  }

  public finish(notification: INotification): string {
    return this.add({
      id: notification.id,
      message: notification.message,
      status: INotificationStatus.Finished
    });
  }

  public fail(notification: INotification): string {
    return this.add({
      id: notification.id,
      message: notification.message,
      status: INotificationStatus.Failed
    });
  }

  public remove(id: string): void {
    const ind = this.notifications.findIndex((el: INotification) => el.id === id);
    if (ind === -1) {
      return;
    }

    if (this.notifications[ind].status === INotificationStatus.Pending) {
      return;
    }

    this.notifications.splice(ind, 1);
  }

  public removeCompleted(): void {
    this.notifications = this.notifications.filter((n: INotification) => n.status === INotificationStatus.Pending);
    this._pendingJobsCount = this.notifications.length;
  }

  public reset(): void {
    this.notifications = [];
    this._pendingJobsCount = 0;
    this._unseenJobsCount$.next(0);
  }

  public resetUnseenJobsCount() {
    this._unseenJobsCount$.next(0);
  }

  private incrementUnseenJobsCount() {
    const unseenCount = this._unseenJobsCount$.getValue();
    this._unseenJobsCount$.next(unseenCount + 1);
  }
}
