import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BackendResource } from '../../shared/decorators';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { padStart } from '../../shared/utils/pad-start';
import { DayPeriod } from '../../shared/components/day-period/day-period.component';
import { Policy, TimePolicy } from './policy-editor/policy-editor.component';
import { SnapshotPolicy } from './snapshot-policy.model';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { PolicyType } from './snapshot-policy-type';

export interface SnapshotPolicyCreationParams {
  policy: Policy<TimePolicy>;
  policyType: PolicyType;
  volumeId: string;
}

@Injectable()
@BackendResource({
  entity: 'SnapshotPolicy',
})
export class SnapshotPolicyService extends BaseBackendService<SnapshotPolicy> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public getPolicyList(volumeId: string): Observable<Policy<TimePolicy>[]> {
    return super.getList({ volumeId }, { command: 'list', entity: 'SnapshotPolicies' }).pipe(
      map(policies => {
        return policies.map(_ => this.transformPolicy(_));
      }),
    );
  }

  public create(params: SnapshotPolicyCreationParams): Observable<void> {
    const policyCreationParams = {
      intervalType: this.transformPolicyTypeToString(params.policyType),
      maxSnaps: params.policy.storedSnapshots,
      schedule: this.transformTimePolicyToSchedule(params.policy),
      timeZone: params.policy.timeZone.geo,
      volumeId: params.volumeId,
    };

    return super.create(policyCreationParams);
  }

  public remove(id: string): Observable<void> {
    return super.remove({ id }, { entity: 'SnapshotPolicies' });
  }

  private convertAmPmTo24(time: Time): Time {
    if (time.period == null) {
      return time;
    }

    if (time.period === DayPeriod.Am) {
      if (time.hour === 12) {
        return {
          hour: 0,
          minute: time.minute,
        };
      }
      return time;
    }
    if (time.hour === 12) {
      return {
        hour: 12,
        minute: time.minute,
      };
    }
    return {
      hour: time.hour + 12,
      minute: time.minute,
    };
  }

  private transformPolicyTypeToString(type: PolicyType): string {
    const policyTypes = {
      [PolicyType.Hourly]: 'hourly',
      [PolicyType.Daily]: 'daily',
      [PolicyType.Weekly]: 'weekly',
      [PolicyType.Monthly]: 'monthly',
    };

    return policyTypes[type];
  }

  private transformTimePolicyToSchedule(policy: Policy<TimePolicy>): string {
    if (policy.timePolicy.hour == null) {
      return policy.timePolicy.minute.toString();
    }

    const timePolicy24 = this.convertAmPmTo24(policy.timePolicy);

    const hours = timePolicy24.hour;
    const minutes = padStart(timePolicy24.minute, 2);
    const weekDay = policy.timePolicy.dayOfWeek;
    const monthDay = policy.timePolicy.dayOfMonth;

    return [minutes, hours, weekDay, monthDay].filter(_ => _ != null).join(':');
  }

  private transformScheduleToTimePolicy(schedule: string, policyType: PolicyType): TimePolicy {
    const parsedSchedule = schedule.split(':');

    switch (parsedSchedule.length) {
      case 1:
        return {
          minute: +parsedSchedule[0],
        };
      case 2:
        return {
          hour: +parsedSchedule[1],
          minute: +parsedSchedule[0],
        };
      case 3:
        const timePolicy: TimePolicy = {
          hour: +parsedSchedule[1],
          minute: +parsedSchedule[0],
        };

        if (policyType === PolicyType.Weekly) {
          timePolicy.dayOfWeek = +parsedSchedule[2];
        }

        if (policyType === PolicyType.Monthly) {
          timePolicy.dayOfMonth = +parsedSchedule[2];
        }

        return timePolicy;
      default:
        throw new Error('Incorrect snapshot policy format');
    }
  }

  private transformPolicy(policy: SnapshotPolicy): Policy<TimePolicy> {
    return {
      id: policy.id,
      storedSnapshots: policy.maxsnaps,
      timePolicy: this.transformScheduleToTimePolicy(policy.schedule, policy.intervaltype),
      timeZone: { geo: policy.timezone },
      type: policy.intervaltype,
    };
  }
}
