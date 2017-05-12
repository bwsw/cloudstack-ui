import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ConfigService } from '../../../shared';

import {
  AbstractPolicy,
  DailyPolicy,
  HourlyPolicy,
  MonthlyPolicy,
  RecurringSnapshotPolicy,
  Timezone,
  WeeklyPolicy
} from '../recurring-snapshots.component';


@Component({
  selector: 'cs-period-selector',
  templateUrl: 'period-selector.component.html',
  styleUrls: ['period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {
  @Input() public policy: RecurringSnapshotPolicy;
  @Output() public onPolicyChange = new EventEmitter<AbstractPolicy>();

  public currentPolicy: AbstractPolicy;
  public Policy = RecurringSnapshotPolicy;

  public timezone: Timezone;
  public timezones: Array<Timezone>;

  public time: string;

  public maxSnapshotsPerInterval = 8; // investigate if this is configurable

  constructor(
    private configService: ConfigService,
    private translateService: TranslateService
  ) {
    this.configService.get('timezones')
      .subscribe(timezones => {
        this.timezones = timezones;
      });
  }

  public ngOnInit(): void {
    this.currentPolicy = this.convertEnumPolicyToClass(this.policy);
  }

  public get minutesErrorMessage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: 0,
      upperLimit: 59
    });
  }

  public get storedSnapshotsErrorMesssage(): Observable<string> {
    return this.translateService.get('BETWEEN', {
      lowerLimit: 1,
      upperLimit: this.maxSnapshotsPerInterval
    });
  }

  private convertEnumPolicyToClass(enumPolicy: RecurringSnapshotPolicy): AbstractPolicy {
    switch (enumPolicy) {
      case (RecurringSnapshotPolicy.Hourly):
        return new HourlyPolicy();
      case (RecurringSnapshotPolicy.Daily):
        return new DailyPolicy();
      case (RecurringSnapshotPolicy.Weekly):
        return new WeeklyPolicy();
      case (RecurringSnapshotPolicy.Monthly):
        return new MonthlyPolicy();
      default:
        throw new Error('invalid policy');
    }
  }
}
