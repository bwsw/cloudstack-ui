import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { SecurityGroupCreationContainerComponent } from '../containers/security-group-creation.container';

@Component({
  selector: 'cs-security-group-create-dialog',
  template: ``,
})
export class SecurityGroupCreationDialogComponent {
  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    this.dialog
      .open(SecurityGroupCreationContainerComponent, {
        data: {},
        disableClose: true,
        width: '405px',
      } as MatDialogConfig)
      .afterClosed()
      .subscribe(() =>
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.route,
        }),
      );
  }
}
