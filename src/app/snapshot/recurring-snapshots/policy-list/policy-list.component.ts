import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material';

import { TimeFormat } from '../../../shared/services/language.service';
import { Policy, TimePolicy } from '../policy-editor/policy-editor.component';
import { PolicyViewBuilderService } from './policy-view-builder.service';
import { PolicyType } from '../snapshot-policy-type';
import DateTimeFormat = Intl.DateTimeFormat;


interface PolicyView {
  id: string;
  type: PolicyType;
  timeToken: string;
  timeValue: string;
  periodToken: string;
  periodValue: string;
  timeZone: string;
  keep: number;
}

@Component({
  selector: 'cs-policy-list',
  templateUrl: 'policy-list.component.html',
  styleUrls: ['policy-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyListComponent implements OnChanges {
  @Input() public timeFormat: TimeFormat;

  @Input() public policies: Array<Policy<TimePolicy>>;
  @Output() public onPolicyDelete: EventEmitter<Policy<TimePolicy>>;
  @Output() public onPolicyRowClick: EventEmitter<PolicyType>;

  public policyViews = new MatTableDataSource<PolicyView>([]);
  public columnsToDisplay = ['time', 'period', 'timeZone', 'keep', 'delete'];

  constructor(
    private policyViewBuilderService: PolicyViewBuilderService,
    private translateService: TranslateService
  ) {
    this.onPolicyDelete = new EventEmitter<Policy<TimePolicy>>();
    this.onPolicyRowClick = new EventEmitter<PolicyType>();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.updatePolicyViews();
  }

  private get locale(): string {
    return this.translateService.currentLang;
  }

  private get dateTimeFormat(): DateTimeFormat {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric'
    };

    options.hour12 = this.timeFormat === TimeFormat.hour12 || this.timeFormat === TimeFormat.AUTO;

    return new Intl.DateTimeFormat(this.locale, options);
  }

  public deletePolicy(policy: Policy<TimePolicy>): void {
    this.onPolicyDelete.next(policy);
  }

  private updatePolicyViews(): void {
    this.policyViews.data = this.getPolicyViews(this.policies, this.dateTimeFormat);
  }

  public handlePolicyRowClick(policyView: PolicyView): void {
    this.onPolicyRowClick.emit(policyView.type);
  }

  private getPolicyViews(
    policies: Array<Policy<TimePolicy>>,
    dateTimeFormat: DateTimeFormat
  ): Array<PolicyView> {
    return policies.map(policy => {
      return this.policyViewBuilderService.buildPolicyViewFromPolicy(
        policy,
        dateTimeFormat
      );
    })
      .sort((a, b) => this.policyViewComparator(a, b));
  }

  private policyViewComparator(a: PolicyView, b: PolicyView): number {
    return this.convertPolicyTypeToNumber(a.type) - this.convertPolicyTypeToNumber(b.type);
  }

  private convertPolicyTypeToNumber(type: PolicyType): number {
    switch (type) {
      case PolicyType.Hourly:
        return 0;
      case PolicyType.Daily:
        return 1;
      case PolicyType.Weekly:
        return 2;
      case PolicyType.Monthly:
        return 3;
      default:
        throw new Error('Invalid policy type');
    }
  }
}
