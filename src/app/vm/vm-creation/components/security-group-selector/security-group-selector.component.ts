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
  public _selectedSecurityGroups: Array<SecurityGroup> = [];

  @Input()
  public get selectedSecurityGroups(): Array<SecurityGroup> {
    return this._selectedSecurityGroups;
  }

  public writeValue(value: Array<SecurityGroup>): void {
    if (value) {
      this._selectedSecurityGroups = value;
    }
  }

  public propagateChange: any = () => {
  };

  public registerOnTouched(): any {
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public selectSecurityGroup(securityGroup: SecurityGroup): void {
    if (this.checkSelectedSG(securityGroup.id)) {
      const index = this.selectedSecurityGroups.findIndex(_ => _.id === securityGroup.id);
      this.selectedSecurityGroups.splice(index, 1);
    } else {
      this.selectedSecurityGroups.push(securityGroup);
    }
  }

  public checkSelectedSG(securityGroupId: string): boolean {
    const isSelectedItem = this.selectedSecurityGroups.find(securityGroup => securityGroup.id === securityGroupId);
    return !!isSelectedItem;
  }
}
