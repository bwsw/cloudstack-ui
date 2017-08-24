import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
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
    private dialogService: DialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService
  ) {
  }

  ngOnInit() {
    this.dialogService.showCustomDialog({
      component: SpareDriveCreationComponent,
      classes: 'spare-drive-creation-dialog',
      clickOutsideToClose: false
    })
      .switchMap(res => res.onHide())
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
