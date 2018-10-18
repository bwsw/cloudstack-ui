import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utils } from './utils/utils.service';

export enum INotificationStatus {
  Pending,
  Finished,
  Failed,
}

export interface JobNotification {
  id: string;
  message: string;
  status?: INotificationStatus;
}

@Injectable()
export class JobsNotificationService {
  public notifications: JobNotification[];
  /*
   * pendingJobsCount not included in unseenCompletedJobsCount
   * Only after the end of the pending job, the counter of unseen jobs is increased
   */
  // tslint:disable-next-line:variable-name
  private readonly _pendingJobsCount$ = new BehaviorSubject<number>(0);
  // tslint:disable-next-line:variable-name
  private readonly _unseenCompletedJobsCount$ = new BehaviorSubject<number>(0);

  public get pendingJobsCount$(): Observable<number> {
    return this._pendingJobsCount$.asObservable();
  }

  public get unseenCompletedJobsCount$(): Observable<number> {
    return this._unseenCompletedJobsCount$.asObservable();
  }

  public add(message: string): string {
    const id = Utils.getUniqueId();
    const n: JobNotification = {
      id,
      message,
      status: INotificationStatus.Pending,
    };

    this.notifications.unshift(n);
    this.incrementPendingJobsCount();

    return id;
  }

  public finish(notification: JobNotification): void {
    this.completeJob({
      id: notification.id,
      message: notification.message,
      status: INotificationStatus.Finished,
    });
  }

  public fail(notification: JobNotification): void {
    this.completeJob({
      id: notification.id,
      message: notification.message,
      status: INotificationStatus.Failed,
    });
  }

  public remove(id: string): void {
    const ind = this.notifications.findIndex((el: JobNotification) => el.id === id);
    if (ind === -1) {
      return;
    }

    if (this.notifications[ind].status === INotificationStatus.Pending) {
      return;
    }

    this.notifications.splice(ind, 1);
  }

  public removeCompleted(): void {
    this.notifications = this.notifications.filter(
      (n: JobNotification) => n.status === INotificationStatus.Pending,
    );
    this._pendingJobsCount$.next(this.notifications.length);
  }

  public reset(): void {
    this.notifications = [];
    this._pendingJobsCount$.next(0);
    this._unseenCompletedJobsCount$.next(0);
  }

  public resetUnseenCompletedJobsCount() {
    this._unseenCompletedJobsCount$.next(0);
  }

  private completeJob(notification: JobNotification) {
    const index = this.notifications.findIndex(el => el.id === notification.id);
    if (index === -1) {
      this.notifications.unshift(notification);
    } else {
      this.notifications[index] = notification;
    }

    this.incrementUnseenCompletedJobsCount();
    this.decrementPendingJobsCount();
  }

  private incrementUnseenCompletedJobsCount() {
    const unseenCount = this._unseenCompletedJobsCount$.getValue();
    this._unseenCompletedJobsCount$.next(unseenCount + 1);
  }

  private incrementPendingJobsCount() {
    const pendingJobsCount = this._pendingJobsCount$.getValue();
    this._pendingJobsCount$.next(pendingJobsCount + 1);
  }

  private decrementPendingJobsCount() {
    const pendingJobsCount = this._pendingJobsCount$.getValue();
    this._pendingJobsCount$.next(pendingJobsCount - 1);
  }
}
