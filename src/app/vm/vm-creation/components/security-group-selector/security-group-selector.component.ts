import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SecurityGroupService } from '../../../../security-group/services/security-group.service';
import { SecurityGroup } from '../../../../security-group/sg.model';


@Component({
  selector: 'cs-security-group-selector',
  templateUrl: 'security-group-selector.component.html',
  styleUrls: ['security-group-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SecurityGroupSelectorComponent),
      multi: true
    }
  ]
})
export class SecurityGroupSelectorComponent implements ControlValueAccessor, OnInit {
  public _securityGroup: SecurityGroup;
  public securityGroups: Array<SecurityGroup>;

  constructor(private securityGroupService: SecurityGroupService) {}

  public ngOnInit(): void {
    this.securityGroupService.getSharedGroups()
      .subscribe(sharedGroups => {
        this.securityGroups = sharedGroups;

        if (!this.securityGroup && this.securityGroups.length) {
          this.securityGroup = this.securityGroups[0];
        }
      });
  }

  @Input()
  public get securityGroup(): SecurityGroup {
    return this._securityGroup;
  }

  public set securityGroup(value: SecurityGroup) {
    if (value) {
      this._securityGroup = value;
      this.propagateChange(this.securityGroup);
    }
  }

  public writeValue(value: SecurityGroup): void {
    if (value) {
      this.securityGroup = value;
    }
  }

  public propagateChange: any = () => {};
  public registerOnTouched(): any {}

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public selectSecurityGroup(securityGroup: SecurityGroup): void {
    this.securityGroup = securityGroup;
  }
}
