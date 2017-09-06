import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
export class SecurityGroupSelectorComponent implements ControlValueAccessor {
  @Input() public securityGroups: Array<SecurityGroup>;
  public _securityGroup: SecurityGroup;

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
