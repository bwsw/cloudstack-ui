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
import { TimeFormat, TimeFormats } from '../../../shared/services';
import { Policy, TimePolicy } from '../policy-editor/policy-editor.component';
import { PolicyType } from '../recurring-snapshots.component';
import { PolicyViewBuilderService } from './policy-view-builder.service';
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

  public policyViews: Array<PolicyView>;

  constructor(
    private policyViewBuilderService: PolicyViewBuilderService,
    private translateService: TranslateService
  ) {
    this.onPolicyDelete = new EventEmitter<Policy<TimePolicy>>();
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

    options.hour12 = this.timeFormat === TimeFormats.hour12 || this.timeFormat === TimeFormats.AUTO;

    return new Intl.DateTimeFormat(this.locale, options);
  }

  public deletePolicy(policy: Policy<TimePolicy>): void {
    this.onPolicyDelete.next(policy);
  }

  private updatePolicyViews(): void {
    this.policyViews = this.getPolicyViews(this.policies, this.dateTimeFormat);
  }

  private getPolicyViews(
    policies: Array<Policy<TimePolicy>>,
    dateTimeFormat: DateTimeFormat
  ): Array<PolicyView> {
    return policies.map(policy => {
      return this.policyViewBuilderService.buildPolicyViewFromPolicy(policy, dateTimeFormat);
    });
  }
}
