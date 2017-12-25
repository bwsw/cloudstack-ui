import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SecurityGroupCreationContainerComponent } from '../containers/security-group-creation.container';


@Component({
  selector: 'cs-security-group-create-dialog',
  template: ``
})
export class SecurityGroupCreationDialogComponent {
  constructor(private dialog: MatDialog) {
    this.dialog.open(SecurityGroupCreationContainerComponent, <MatDialogConfig>{
      data: { },
      disableClose: true,
      width: '405px'
    })
  }


}
