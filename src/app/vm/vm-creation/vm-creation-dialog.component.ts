import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { VmCreationContainerComponent } from './containers/vm-creation.container';

@Component({
  selector: 'cs-vm-create-dialog',
  template: `<ng-template></ng-template>`,
})
export class VmCreationDialogComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.dialog
      .open(VmCreationContainerComponent, {
        disableClose: true,
        width: '600px',
      })
      .afterClosed()
      .subscribe(vm => {
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.activatedRoute,
        });
      });
  }
}
