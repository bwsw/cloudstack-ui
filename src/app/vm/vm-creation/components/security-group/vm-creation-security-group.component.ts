import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SecurityGroupService } from '../../../../security-group/services/security-group.service';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { Rules } from '../../../../shared/components/security-group-builder/rules';
// tslint:disable-next-line
import { VmCreationSecurityGroupData } from '../../security-group/vm-creation-security-group-data';
import { VmCreationSecurityGroupMode } from '../../security-group/vm-creation-security-group-mode';
import { AuthService } from '../../../../shared/services/auth.service';


@Component({
  selector: 'cs-vm-creation-security-group',
  templateUrl: 'vm-creation-security-group.component.html',
  styleUrls: ['vm-creation-security-group.component.scss']
})
export class VmCreationSecurityGroupComponent implements OnInit {
  public sharedGroups: Array<SecurityGroup>;

  public get savedData(): VmCreationSecurityGroupData {
    return this._savedData;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public _savedData: VmCreationSecurityGroupData,
              private dialogRef: MatDialogRef<VmCreationSecurityGroupComponent>,
              private securityGroupService: SecurityGroupService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    const account = this.authService.user.username;
    this.securityGroupService.getSharedGroups()
      .subscribe(groups => {
        this.sharedGroups = groups.filter(item => item.account === account);
        if (!this._savedData.securityGroups) {
          this._savedData.securityGroups = [this.sharedGroups[0]];
        }
      });
  }

  public setMode(mode): void {
    this.displayMode = mode;
  }

  public get displayMode(): VmCreationSecurityGroupMode {
    return this._savedData.mode;
  }

  public set displayMode(value: VmCreationSecurityGroupMode) {
    const map = {
      0: VmCreationSecurityGroupMode.Builder,
      1: VmCreationSecurityGroupMode.Selector
    };

    this._savedData.mode = map[value];
  }

  public get isModeBuilder(): boolean {
    return this.displayMode === VmCreationSecurityGroupMode.Builder;
  }

  public get isModeSelector(): boolean {
    return this.displayMode === VmCreationSecurityGroupMode.Selector;
  }

  public get title(): string {
    if (this.isModeBuilder) {
      return 'SECURITY_GROUP_SELECTOR.BUILD_NEW_GROUP';
    }

    if (this.isModeSelector) {
      return 'SECURITY_GROUP_SELECTOR.SELECT_EXISTING_GROUP';
    }
  }

  public onSave(): void {
    this.dialogRef.close(this._savedData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onBuilderGroupChange(rules: Rules): void {
    this._savedData.rules = rules;
  }
}
