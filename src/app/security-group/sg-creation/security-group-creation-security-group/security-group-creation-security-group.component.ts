import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Rules } from '../../../shared/components/security-group-builder/rules';

@Component({
  selector: 'cs-security-group-creation-security-group',
  templateUrl: 'security-group-creation-security-group.component.html',
})
export class SecurityGroupCreationSecurityGroupComponent {
  constructor(
    private dialogRef: MatDialogRef<SecurityGroupCreationSecurityGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public savedData: Rules,
  ) {}

  public onSave(): void {
    this.dialogRef.close(this.savedData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onBuilderGroupChange(rules: Rules): void {
    this.savedData = rules;
  }
}
