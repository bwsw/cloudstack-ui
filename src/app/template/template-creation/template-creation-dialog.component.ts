import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../shared/components/list/list.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { TemplateCreationComponent } from './template-creation.component';


@Component({
  selector: 'cs-template-create-dialog',
  template: ``
})
export class TemplateCreationDialogComponent {
  constructor(
    private listService: ListService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) {
    const viewMode = this.storageService.read('templateDisplayMode') || 'Template';

    this.dialog.open(TemplateCreationComponent, {
      data: { mode: viewMode },
      disableClose: true,
      width: '720px'
    })
      .afterClosed()
      .subscribe(templateData => {
        if (templateData) {
          this.listService.onUpdate.emit(templateData);
        }
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.activatedRoute
        });
      });
  }

  private get viewMode(): string {
    return this.storageService.read('templateDisplayMode') || 'Template';
  }
}
