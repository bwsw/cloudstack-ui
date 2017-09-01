import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { VmCreationComponent } from './vm-creation.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cs-vm-create-dialog',
  template: ``
})
export class VmCreationDialogComponent implements OnInit {
  constructor(
    private dialog: MdDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.dialog.open(VmCreationComponent, {
      disableClose: true,
      width: '755px'
    })
      .afterClosed()
      .subscribe(vm => {
        this.router.navigate(['../'], {
          preserveQueryParams: true,
          relativeTo: this.activatedRoute
        });
      });
  }
}
