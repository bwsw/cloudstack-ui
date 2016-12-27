import { Component, OnInit, Output, EventEmitter, Input, forwardRef } from '@angular/core';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup, NetworkRule } from './security-group.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface RuleListItem {
  rule: NetworkRule;
  checked: boolean;
}

export interface IRules { // defines what should be passed to ngModel
  ingress: Array<NetworkRule>;
  egress: Array<NetworkRule>;
}

@Component({
  selector: 'cs-security-group-creation',
  templateUrl: './security-group-creation.component.html',
  styleUrls: ['./security-group-creation.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SecurityGroupCreationComponent),
      multi: true
    }
  ]
})
export class SecurityGroupCreationComponent implements OnInit, ControlValueAccessor {
  public _rules: IRules;

  @Output() public onSave = new EventEmitter();

  private items: Array<Array<SecurityGroup>>;
  private selectedGroupIndex: number;
  private selectedColumnIndex: number;
  private selectedRules: Array<Array<RuleListItem>>;

  constructor(private securityGroupService: SecurityGroupService) {
    this.items = [[], []];
    this.selectedRules = [[], []];
  }

  public ngOnInit() {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList();

    Promise.all([securityGroupTemplates, accountSecurityGroups])
      .then(([templates, groups]) => {
        this.items[0] = templates.concat(groups);
      });
  }

  public propagateChange: any = () => {};

  @Input()
  public get rules() {
    return this._rules;
  }

  public set rules(value) {
    this._rules = value;
    this.propagateChange(value);
  }

  public writeValue(value) {
    if (value) {
      this.rules = value;
    }
  }

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() { }

  public selectGroup(index: number, left: boolean) {
    this.selectedGroupIndex = index;
    this.selectedColumnIndex = left ? 0 : 1;
  }

  public onCheckBoxChange() {
    this.updateRules();
  }

  public move(left: boolean) {
    if (this.selectedGroupIndex === -1) {
      return;
    }

    const moveToIndex = left ? 0 : 1;
    const moveFromIndex = this.items.length - moveToIndex - 1;

    if (!left) {
      const group = this.items[0][this.selectedGroupIndex];
      for (let i = 0; i < group.ingressRules.length; i++) {
        this.selectedRules[0].push({
          rule: group.ingressRules[i],
          checked: false
        });
      }

      for (let i = 0; i < group.egressRules.length; i++) {
        this.selectedRules[1].push({
          rule: group.egressRules[i],
          checked: false
        });
      }
    } else {
      const group = this.items[1][this.selectedGroupIndex];

      let startIndex = 0;
      for (let i = 0; i < this.selectedGroupIndex; i++) {
        startIndex += this.items[1][i].ingressRules.length;
      }
      this.selectedRules[0].splice(startIndex, group.ingressRules.length);

      startIndex = 0;
      for (let i = 0; i < this.selectedGroupIndex; i++) {
        startIndex += this.items[1][i].egressRules.length;
      }
      this.selectedRules[1].splice(startIndex, group.egressRules.length);
    }

    this.updateRules();

    this.items[moveToIndex].push(this.items[moveFromIndex][this.selectedGroupIndex]);
    this.items[moveFromIndex].splice(this.selectedGroupIndex, 1);

    this.selectedGroupIndex = -1;
    this.selectedColumnIndex = -1;
  }

  public save() {
    this.onSave.emit();
  }

  private updateRules() {
    this.rules = {
      ingress: this.selectedRules[0].filter(rule => rule.checked).map(item => item.rule),
      egress: this.selectedRules[1].filter(rule => rule.checked).map(item => item.rule),
    };
  }
}
