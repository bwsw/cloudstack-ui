import { Component } from '@angular/core';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { VmCreationSecurityGroupMode } from '../../security-group/vm-creation-security-group-mode';
import { Rules } from '../../../../shared/components/security-group-builder/rules';
import { MdDialogRef } from '@angular/material';
// tslint:disable-next-line
import { SpareDriveAttachmentDialogComponent } from '../../../vm-sidebar/storage-detail/spare-drive-attachment/spare-drive-attchment-dialog/spare-drive-attachment-dialog.component';


@Component({
  selector: 'cs-vm-creation-security-group',
  templateUrl: 'security-group.component.html',
  styleUrls: ['security-group.component.scss']
})
export class VmCreationSecurityGroupComponent {
  public builderRules: Rules;
  public selectedSecurityGroup: SecurityGroup;
  private _displayMode = VmCreationSecurityGroupMode.Builder;

  constructor(private dialogRef: MdDialogRef<SpareDriveAttachmentDialogComponent>) {}

  public get displayMode(): VmCreationSecurityGroupMode {
    return this._displayMode;
  }

  public set displayMode(value: VmCreationSecurityGroupMode) {
    const map = {
      0: VmCreationSecurityGroupMode.Builder,
      1: VmCreationSecurityGroupMode.Selector
    };

    this._displayMode = map[value];
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
    this.dialogRef.close(this.dialogCloseData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onBuilderGroupChange(rules: Rules): void {
    this.builderRules = rules;
  }

  public onSelectedGroupChange(securityGroup: SecurityGroup) {
    debugger;
    this.selectedSecurityGroup = securityGroup;
  }

  private get dialogCloseData(): Rules | SecurityGroup {
    if (this.displayMode === VmCreationSecurityGroupMode.Builder) {
      return this.builderRules;
    } else {
      return this.selectedSecurityGroup;
    }
  }
}
