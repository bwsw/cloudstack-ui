import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { VolumeCreationContainerComponent } from '../container/volume-creation.container';

@Component({
  selector: 'cs-volume-creation',
  template: ``,
})
export class VolumeCreationComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.dialog
      .open(VolumeCreationContainerComponent, {
        width: '405px',
        disableClose: true,
      })
      .afterClosed()
      .subscribe(() => {
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.activatedRoute,
        });
      });
  }
}
