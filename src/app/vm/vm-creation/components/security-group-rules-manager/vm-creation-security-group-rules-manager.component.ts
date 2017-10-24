import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Rules } from '../../../../shared/components/security-group-builder/rules';
import { VmCreationSecurityGroupData } from '../../security-group/vm-creation-security-group-data';
import { VmCreationSecurityGroupMode } from '../../security-group/vm-creation-security-group-mode';
import { VmCreationSecurityGroupComponent } from '../security-group/vm-creation-security-group.component';


@Component({
  selector: 'cs-vm-creation-security-group-rules-manager',
  templateUrl: 'vm-creation-security-group-rules-manager.component.html',
  styleUrls: ['vm-creation-security-group-rules-manager.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VmCreationSecurityGroupRulesManagerComponent),
      multi: true
    }
  ]
})
export class VmCreationSecurityGroupRulesManagerComponent implements ControlValueAccessor {
  public savedData: VmCreationSecurityGroupData;

  private _securityGroupRulesManagerData: VmCreationSecurityGroupData;

  constructor(private dialog: MatDialog) {
    this.savedData = VmCreationSecurityGroupData.fromRules(new Rules());
  }

  public propagateChange: any = () => {};

  @Input()
  public get securityGroupRulesManagerData(): VmCreationSecurityGroupData {
    return this._securityGroupRulesManagerData;
  }

  public set securityGroupRulesManagerData(value: VmCreationSecurityGroupData) {
    this._securityGroupRulesManagerData = value;
    this.propagateChange(value);
  }

  public writeValue(value: VmCreationSecurityGroupData): void {
    this.updateData(value);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public get isModeNew(): boolean {
    return this.savedData && this.savedData.mode === VmCreationSecurityGroupMode.Builder;
  }

  public get isModeExisting(): boolean {
    return this.savedData && this.savedData.mode === VmCreationSecurityGroupMode.Selector;
  }

  public get showAddButton(): boolean {
    return !this.showEditButton;
  }

  public get showEditButton(): boolean {
    return (
      (this.isModeNew &&
        this.savedData &&
        this.savedData.rules &&
        this.savedData.rules.templates &&
        !!this.savedData.rules.templates.length) ||
      (this.isModeExisting && this.savedData && !!this.savedData.securityGroup)
    );
  }

  public showDialog(): void {
    this.dialog.open(VmCreationSecurityGroupComponent, {
      width: '800px',
      data: this.savedData
    })
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {
          this.updateData(data);
        }
      });
  }

  private updateData(data: VmCreationSecurityGroupData): void {
    this.savedData = data;
    this.securityGroupRulesManagerData = this.savedData;
  }
}

