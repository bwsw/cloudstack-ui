import { Component, Inject, Input } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { Rules } from '../../../../shared/components/security-group-builder/rules';
// tslint:disable-next-line
import { SecurityGroupRulesManagerData } from '../../../../shared/components/security-group-rules-manager/sg-rules-manager.component';
// tslint:disable-next-line
import { SpareDriveAttachmentDialogComponent } from '../../../vm-sidebar/storage-detail/spare-drive-attachment/spare-drive-attchment-dialog/spare-drive-attachment-dialog.component';
import { VmCreationSecurityGroupData } from '../../security-group/vm-creation-security-group-data';
import { VmCreationSecurityGroupMode } from '../../security-group/vm-creation-security-group-mode';


@Component({
  selector: 'cs-vm-creation-security-group',
  templateUrl: 'security-group.component.html',
  styleUrls: ['security-group.component.scss']
})
export class VmCreationSecurityGroupComponent {
  constructor(
    private dialogRef: MdDialogRef<SpareDriveAttachmentDialogComponent>,
    @Inject(MD_DIALOG_DATA) public savedData: VmCreationSecurityGroupData
  ) {}

  public get displayMode(): VmCreationSecurityGroupMode {
    return this.savedData.mode;
  }

  public set displayMode(value: VmCreationSecurityGroupMode) {
    const map = {
      0: VmCreationSecurityGroupMode.Builder,
      1: VmCreationSecurityGroupMode.Selector
    };

    this.savedData.mode = map[value];
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
    this.dialogRef.close(this.savedData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onBuilderGroupChange(rules: Rules): void {
    this.savedData.rules = rules;
  }

  public onSelectedGroupChange(securityGroup: SecurityGroup) {
    debugger;
    this.savedData.securityGroup = securityGroup;
  }
}
