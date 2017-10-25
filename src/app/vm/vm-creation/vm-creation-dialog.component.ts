import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { VmCreationComponent } from './vm-creation.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cs-vm-create-dialog',
  template: ``
})
export class VmCreationDialogComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.dialog.open(VmCreationComponent, {
      disableClose: true,
      width: '755px'
    })
      .afterClosed()
      .subscribe(vm => {
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.activatedRoute
        });
      });
  }
}
