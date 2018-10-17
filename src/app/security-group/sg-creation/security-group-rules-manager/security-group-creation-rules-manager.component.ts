import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Rules } from '../../../shared/components/security-group-builder/rules';
import { MatDialog } from '@angular/material';
// tslint:disable-next-line
import { SecurityGroupCreationSecurityGroupComponent } from '../security-group-creation-security-group/security-group-creation-security-group.component';

@Component({
  selector: 'cs-security-group-creation-rules-manager',
  templateUrl: 'security-group-creation-rules-manager.component.html',
  styleUrls: ['security-group-creation-rules-manager.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SecurityGroupCreationRulesManagerComponent),
      multi: true,
    },
  ],
})
export class SecurityGroupCreationRulesManagerComponent {
  public savedData = new Rules();
  // tslint:disable-next-line:variable-name
  private _securityGroupRulesManagerData: Rules;

  constructor(private dialog: MatDialog) {}

  public propagateChange: any = () => {};

  @Input()
  public get securityGroupRulesManagerData(): Rules {
    return this._securityGroupRulesManagerData;
  }

  public set securityGroupRulesManagerData(value: Rules) {
    this._securityGroupRulesManagerData = value;
    this.propagateChange(value);
  }

  public writeValue(value: Rules): void {
    this.updateRules(value);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public get showAddButton(): boolean {
    return !this.showEditButton;
  }

  public get showEditButton(): boolean {
    return this.savedData && this.savedData.templates && !!this.savedData.templates.length;
  }

  public showDialog(): void {
    this.dialog
      .open(SecurityGroupCreationSecurityGroupComponent, {
        width: '720px',
        data: this.savedData,
      })
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {
          this.updateRules(data);
        }
      });
  }

  private updateRules(data: Rules): void {
    if (data) {
      this.savedData = data;
      this.securityGroupRulesManagerData = this.savedData;
    }
  }
}
