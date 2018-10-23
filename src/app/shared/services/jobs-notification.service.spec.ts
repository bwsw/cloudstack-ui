import { Injectable } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { INotificationStatus, JobsNotificationService } from './jobs-notification.service';

@Injectable()
export class MockAuthService {
  public loggedIn = new Subject<boolean>();
}

describe('Jobs notification service', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [JobsNotificationService, { provide: AuthService, useClass: MockAuthService }],
    });
  }));

  it('should add new notification', inject([JobsNotificationService], jobsNotificationService => {
    jobsNotificationService.reset();
    jobsNotificationService.add('new job');
    expect(jobsNotificationService.notifications.length).toBe(1);
    expect(jobsNotificationService.notifications[0].message).toBe('new job');

    jobsNotificationService.add('another job');
    expect(jobsNotificationService.notifications.length).toBe(2);
    expect(jobsNotificationService.notifications[0].message).toBe('another job');
  }));

  it('should update the status to "finished"', inject(
    [JobsNotificationService],
    jobsNotifications => {
      jobsNotifications.reset();
      const id = jobsNotifications.add('new job');

      jobsNotifications.finish({ id });
      expect(jobsNotifications.notifications[0].status).toBe(INotificationStatus.Finished);
    },
  ));

  it('should update the status to "failed"', inject(
    [JobsNotificationService],
    jobsNotifications => {
      jobsNotifications.reset();
      const id = jobsNotifications.add('new job');

      jobsNotifications.fail({ id });
      expect(jobsNotifications.notifications[0].status).toBe(INotificationStatus.Failed);
    },
  ));

  it('should remove notification by id if it ends', inject(
    [JobsNotificationService],
    jobsNotificationService => {
      jobsNotificationService.reset();
      jobsNotificationService.add('new job');
      const id = jobsNotificationService.add('another job');

      jobsNotificationService.remove('non-existent');
      expect(jobsNotificationService.notifications.length).toBe(2);

      jobsNotificationService.remove(id); // operation in pending state
      expect(jobsNotificationService.notifications.length).toBe(2);

      jobsNotificationService.finish({ id, message: 'done' });
      jobsNotificationService.remove(id);
      expect(jobsNotificationService.notifications.length).toBe(1);

      expect(jobsNotificationService.notifications[0].message).toBe('new job');
    },
  ));

  it('should remove all finished jobs', inject(
    [JobsNotificationService],
    jobsNotificationService => {
      jobsNotificationService.reset();
      const id1 = jobsNotificationService.add('new job');
      const id2 = jobsNotificationService.add('another job');
      jobsNotificationService.add('another one');

      jobsNotificationService.finish({ id: id1, message: 'done' });
      jobsNotificationService.finish({ id: id2, message: 'done' });

      jobsNotificationService.removeCompleted();

      expect(jobsNotificationService.notifications.length).toBe(1);
      expect(jobsNotificationService.notifications[0].message).toBe('another one');
    },
  ));
});
