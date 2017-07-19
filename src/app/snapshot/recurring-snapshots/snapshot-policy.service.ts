import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendService } from '../../shared/services';
import { DayPeriod } from './day-period/day-period.component';
import { Policy, TimePolicy } from './policy-editor/policy-editor.component';
import { PolicyType } from './recurring-snapshots.component';
import { SnapshotPolicy } from './snapshot-policy.model';


export interface SnapshotPolicyCreationParams {
  policy: Policy<TimePolicy>;
  policyType: PolicyType;
  volumeId: string;
}

@Injectable()
@BackendResource({
  entity: 'SnapshotPolicy',
  entityModel: SnapshotPolicy
})
export class SnapshotPolicyService extends BaseBackendService<SnapshotPolicy> {
  public getPolicyList(volumeId: string): Observable<Array<Policy<TimePolicy>>> {
    return super.getList(
      { volumeId },
      { command: 'list', entity: 'SnapshotPolicies' }
    )
      .map(policies => {
        return policies.map(_ => this.transformPolicy(_));
      });
  }

  public create(params: SnapshotPolicyCreationParams): Observable<void> {
    const policyCreationParams = {
      intervalType: this.transformPolicyTypeToString(params.policyType),
      maxSnaps: params.policy.storedSnapshots,
      schedule: this.transformTimePolicyToSchedule(params.policy.timePolicy),
      timeZone: params.policy.timeZone.geo,
      volumeId: params.volumeId
    };

    return super.create(policyCreationParams);
  }

  public remove(id: string): Observable<void> {
    return super.remove({ id }, { entity: 'SnapshotPolicies' });
  }

  private transformTimePolicyToSchedule(timePolicy: TimePolicy): string {
    if (timePolicy.hour == null) {
      return timePolicy.minute.toString();
    } else {
      const minutes = this.pad(timePolicy.minute);
      const hours = timePolicy.hour.toString();
      const pm = '1';

      if (timePolicy.period === DayPeriod.Am) {
        return `${minutes}:${hours}`;
      } else {
        return `${minutes}:${hours}:${pm}`;
      }
    }
  }

  private transformPolicyTypeToString(type: PolicyType): string {
    switch (type) {
      case PolicyType.Hourly:
        return 'hourly';
      case PolicyType.Daily:
        return 'daily';
      case PolicyType.Weekly:
        return 'weekly';
      case PolicyType.Monthly:
        return 'monthly';
      default:
        throw new Error('Incorrect policy mode');
    }
  }

  private transformScheduleToTimePolicy(schedule: string): Partial<TimePolicy> {
    const parsedSchedule = schedule.split(':');

    switch (parsedSchedule.length) {
      case 1:
        return {
          minute: +parsedSchedule[0]
        };
      case 2:
        return {
          hour: +parsedSchedule[1],
          minute: +parsedSchedule[0],
          period: DayPeriod.Am
        };
      case 3:
        if (+parsedSchedule[2] === 1) {
          return {
            hour: +parsedSchedule[1],
            minute: +parsedSchedule[0],
            period: DayPeriod.Pm
          };
        }
        break;
      default:
        throw new Error('Incorrect snapshot policy format');
    }
  }

  private transformPolicy(policy: SnapshotPolicy): Policy<Partial<TimePolicy>> {
    return {
      id: policy.id,
      storedSnapshots: policy.maxSnaps,
      timePolicy: this.transformScheduleToTimePolicy(policy.schedule),
      timeZone: {geo: policy.timeZone},
      type: policy.intervalType
    };
  }

  private pad(value: any): string {
    return +value < 10 ? `0${+value}` : `${+value}`;
  }
}
