export interface INotification {
  id: string;
  message?: string;
  isActive?: boolean;
}

export class JobsNotificationService {
  public notifications: Array<INotification>;
  private lastId: number;
  private _activeJobsCount: number;

  constructor() {
    this.notifications = [];
    this.lastId = 0;
    this._activeJobsCount = 0;
  }

  public get activeJobsCount(): number {
    return this._activeJobsCount;
  }

  public add(notification: INotification | string): void {
    if (typeof notification === 'string') {
      const n: INotification = {
        id: '' + this.lastId++,
        message: notification,
        isActive: true
      };

      this.notifications.unshift(n);
      this._activeJobsCount++;

      if (this.lastId >= Number.MAX_SAFE_INTEGER) {
        this.lastId = 0;
      }
      return;
    }

    const ind = this.notifications.findIndex((el: INotification) => el.id === notification.id);
    if (ind === -1) {
      notification.isActive = true;
      this.notifications.unshift(notification);
      this._activeJobsCount++;
      return;
    }

    Object.assign(this.notifications[ind], notification);
  }

  public remove(id: string): void {
    const ind = this.notifications.findIndex((el: INotification) => el.id === id);
    if (ind === -1 ) {
      return;
    }

    if (this.notifications[ind].isActive) {
      return;
    }

    this.notifications.splice(ind, 1);
  }

  public removeAll() {
    this.notifications = this.notifications.filter((n: INotification) => n.isActive);
  }

  public updateUnseenCount(): void {
    let activeCount = 0;
    this.notifications.forEach((n: INotification) => {
      if (n.isActive) {
        activeCount++;
      }
    });

    this._activeJobsCount = activeCount;
  }
}
