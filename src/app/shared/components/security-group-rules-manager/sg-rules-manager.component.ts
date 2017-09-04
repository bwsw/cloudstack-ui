import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdDialog } from '@angular/material';

import {
  VmCreationSecurityGroupComponent
} from '../../../vm/vm-creation/components/security-group/security-group.component';
import { Rules } from '../security-group-builder/rules';
import { SecurityGroup } from '../../../security-group/sg.model';


export enum SecurityGroupRulesManagerMode {
  New,
  Existing
}

export interface SecurityGroupRulesManagerData {
  mode: SecurityGroupRulesManagerMode,
  rules?: Rules,
  securityGroup?: SecurityGroup
}

@Component({
  selector: 'cs-security-group-rules-manager',
  templateUrl: 'sg-rules-manager.component.html',
  styleUrls: ['sg-rules-manager.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SgRulesManagerComponent),
      multi: true
    }
  ]
})
export class SgRulesManagerComponent implements OnInit, ControlValueAccessor {
  @Input() public mode: 'create' | 'edit';
  @Input() public header = 'VM_PAGE.VM_CREATION.SECURITY_GROUPS';
  public savedData: SecurityGroupRulesManagerData;

  private _securityGroupRulesManagerData: SecurityGroupRulesManagerData;

  constructor(private dialog: MdDialog) {
    this.savedData = {
      mode: SecurityGroupRulesManagerMode.New,
      rules: new Rules()
    };
  }

  public ngOnInit(): void {
    if (!this.mode) {
      this.mode = 'create';
    }
  }

  public propagateChange: any = () => {};

  @Input()
  public get securityGroupRulesManagerData(): SecurityGroupRulesManagerData  {
    return this._securityGroupRulesManagerData;
  }

  public set securityGroupRulesManagerData(value: SecurityGroupRulesManagerData) {
    this._securityGroupRulesManagerData = value;
    this.propagateChange(value);
  }

  public writeValue(value: SecurityGroupRulesManagerData): void {
    this.updateRules(value);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public get showAddButton(): boolean {
    return (
      (this.savedData &&
        this.savedData.rules &&
        this.savedData.rules.templates &&
        !this.savedData.rules.templates.length) ||
      (this.savedData && !this.savedData.securityGroup)
    );
  }

  public get showEditButton(): boolean {
    return (
      (this.savedData &&
        this.savedData.rules &&
        this.savedData.rules.templates &&
        !!this.savedData.rules.templates.length) ||
      (this.savedData && !!this.savedData.securityGroup)
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
          this.updateRules(data);
        }
      });
  }

  private updateRules(data: SecurityGroupRulesManagerData): void {
    this.savedData = data;
    this.securityGroupRulesManagerData = this.savedData;
  }
}

