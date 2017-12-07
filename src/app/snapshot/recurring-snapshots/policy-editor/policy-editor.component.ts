import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { TimeFormat } from '../../../shared/services/language.service';
import { TimeZone } from '../../../shared/components/time-zone/time-zone.service';
import { PolicyType } from '../snapshot-policy-type';


export type TimePolicy = any;

export interface Policy<T> {
  id?: string;
  storedSnapshots: number;
  timePolicy: T;
  timeZone: TimeZone;
  type?: PolicyType
}

@Component({
  selector: 'cs-policy-editor',
  templateUrl: 'policy-editor.component.html',
  styleUrls: ['policy-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyEditorComponent {
  @Input() public timeFormat: TimeFormat;
  @Input() policyMode: PolicyType;
  @Output() onPolicySave: EventEmitter<Policy<TimePolicy>>;

  public Policies = PolicyType;

  public policy = { minute: 0 };

  public timeZone: TimeZone;

  public minStoredSnapshots = 1;
  public maxStoredSnapshots = 8;
  public storedSnapshots = 1;

  constructor() {
    this.onPolicySave = new EventEmitter<Policy<TimePolicy>>();
  }

  public save(): void {
    this.onPolicySave.emit({
      timePolicy: this.policy as TimePolicy,
      timeZone: this.timeZone,
      storedSnapshots: this.storedSnapshots
    });
  }
}
