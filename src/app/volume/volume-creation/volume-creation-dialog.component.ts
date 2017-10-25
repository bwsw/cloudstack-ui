import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { VolumeCreationComponent } from './volume-creation.component';
import { Volume } from '../../shared/models/volume.model';
import { ListService } from '../../shared/components/list/list.service';

@Component({
  selector: 'cs-volume-create-dialog',
  template: ``
})
export class VolumeCreationDialogComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService
  ) {
    this.dialog.open(VolumeCreationComponent, {
      width: '450px',
      disableClose: true
    }).afterClosed()
      .subscribe((volume: Volume) => {
        if (volume) {
          this.listService.onUpdate.emit(volume);
        }
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.activatedRoute
        });
      });
  }
}
