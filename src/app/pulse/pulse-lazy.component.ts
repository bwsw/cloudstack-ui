import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { VmPulseComponent } from './vm-pulse/vm-pulse.component';

/**
 * Used in routing configuration to lazy load pulse plugin.
 */

@Component({
  selector: 'cs-pulse-component',
  template: ` `
})
export class PulseLazyComponent implements OnInit {
  constructor(
    private dialog: MdDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    const vmId = this.route.snapshot.params.id;

    this.dialog
      .open(VmPulseComponent, { data: vmId })
      .afterClosed()
      .subscribe(() =>
        this.router.navigate(['instances'], {
          queryParamsHandling: 'preserve'
        })
      );
  }
}
