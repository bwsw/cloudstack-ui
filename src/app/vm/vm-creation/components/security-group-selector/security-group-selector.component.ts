import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { SecurityGroupService } from '../../../../security-group/services/security-group.service';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


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
  public securityGroups: Array<SecurityGroup>;
  private _selectedSecurityGroup: SecurityGroup;

  constructor(private securityGroupService: SecurityGroupService) {}

  public ngOnInit(): void {
    this.securityGroupService.getSharedGroups()
      .subscribe(sharedGroups => {
        this.securityGroups = sharedGroups;

        if (!this.selectedSecurityGroup && this.securityGroups) {
          this.selectedSecurityGroup = this.securityGroups[0];
        }
      });
  }

  public propagateChange: any = () => {};

  @Input()
  public get selectedSecurityGroup(): SecurityGroup {
    return this._selectedSecurityGroup;
  }

  public set selectedSecurityGroup(value: SecurityGroup) {
    this._selectedSecurityGroup = value;
    this.propagateChange(this.selectedSecurityGroup);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public writeValue(value: SecurityGroup): void {
    if (value != null) {
      this.selectedSecurityGroup = value;
    }
  }
}
