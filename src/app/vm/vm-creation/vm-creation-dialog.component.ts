import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmCreationComponent } from './vm-creation.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cs-vm-create-dialog',
  template: ``
})
export class VmCreationDialogComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.dialogService.showCustomDialog({
      component: VmCreationComponent,
      clickOutsideToClose: false,
      styles: { 'width': '755px', 'padding': '0' },
    })
      .switchMap(res => res.onHide())
      .subscribe(() => {
         this.router.navigate(['../'], {
           preserveQueryParams: true,
           relativeTo: this.activatedRoute
         });
      });

  }
}
