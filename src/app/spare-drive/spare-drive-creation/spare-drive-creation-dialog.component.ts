import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SpareDriveCreationComponent } from './spare-drive-creation.component';
import { Volume } from '../../shared/models/volume.model';
import { ListService } from '../../shared/components/list/list.service';

@Component({
  selector: 'cs-spare-drive-create-dialog',
  template: ``
})
export class SpareDriveCreationDialogComponent implements OnInit {
  constructor(
    private dialog: MdDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService
  ) {
  }

  ngOnInit() {
    this.dialog.open(SpareDriveCreationComponent, {
      width: '450px',
      disableClose: true
    }).afterClosed()
      .subscribe((volume: Volume) => {
        if (volume) {
          this.listService.onUpdate.emit(volume);
        }
        this.router.navigate(['../'], {
          preserveQueryParams: true,
          relativeTo: this.activatedRoute
        });
      });
  }
}
