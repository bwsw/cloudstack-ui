import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SShKeyCreationDialogContainerComponent } from './containers/ssh-key-creation-dialog.container';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cs-ssh-create',
  template: `
    <ng-template></ng-template>`,
})
export class SshKeyCreationComponent {
  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    this.dialog
      .open(SShKeyCreationDialogContainerComponent, {
        disableClose: true,
        width: '360px',
      })
      .afterClosed()
      .subscribe(() =>
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.route,
        }),
      );
  }
}
