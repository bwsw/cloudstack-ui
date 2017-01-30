import { TestBed, async, inject } from '@angular/core/testing';
import { JobsNotificationService, INotificationStatus } from './jobs-notification.service';

describe('Jobs notification service', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ JobsNotificationService ],
      imports: []
    });
  }));

  it('should add new notification', inject([JobsNotificationService], jobsNotificationService => {
    jobsNotificationService.add('new job');
    expect(jobsNotificationService.notifications.length).toBe(1);
    expect(jobsNotificationService.notifications[0].message).toBe('new job');

    jobsNotificationService.add({ id: '123', message: 'another job'});
    expect(jobsNotificationService.notifications.length).toBe(2);
    expect(jobsNotificationService.notifications[0].id).toBe('123');
    expect(jobsNotificationService.notifications[0].message).toBe('another job');

    jobsNotificationService.lastId = Number.MAX_SAFE_INTEGER - 1;
    jobsNotificationService.add('job');
    expect(jobsNotificationService.lastId).toBe(0);
  }));

  it('should modify existing notification', inject([JobsNotificationService], jobsNotificationService => {
    jobsNotificationService.add({ id: '0', message: 'new job'});
    jobsNotificationService.add({ id: '1', message: 'another job'});

    expect(jobsNotificationService.notifications[0].status).toBe(INotificationStatus.Pending);

    jobsNotificationService.add({ id: '1', status: INotificationStatus.Finished });
    expect(jobsNotificationService.notifications[0].status).toBe(INotificationStatus.Finished);
  }));

  it('should remove notification by id', inject([JobsNotificationService], jobsNotificationService => {
    jobsNotificationService.add({ id: '0', message: 'new job'});
    jobsNotificationService.add({ id: '1', message: 'another job'});

    jobsNotificationService.remove('non-existent');
    expect(jobsNotificationService.notifications.length).toBe(2);

    jobsNotificationService.add({ id: '0', status: INotificationStatus.Finished });
    jobsNotificationService.remove('0');

    expect(jobsNotificationService.notifications.length).toBe(1);
    expect(jobsNotificationService.notifications[0].id).toBe('1');
    expect(jobsNotificationService.notifications[0].message).toBe('another job');
  }));

  it('should remove all finished jobs', inject([JobsNotificationService], jobsNotificationService => {
    jobsNotificationService.add('new job');
    jobsNotificationService.add('another job');
    jobsNotificationService.add('another one');

    jobsNotificationService.add({ id: '0', status: INotificationStatus.Finished });
    jobsNotificationService.add({ id: '1', status: INotificationStatus.Finished });

    jobsNotificationService.removeCompleted();

    expect(jobsNotificationService.notifications.length).toBe(1);
    expect(jobsNotificationService.notifications[0].message).toBe('another one');
  }));
});
