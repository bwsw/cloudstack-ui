import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateCreationComponent } from './template-creation.component';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ListService } from '../../shared/components/list/list.service';

@Component({
  selector: 'cs-template-create-dialog',
  template: ``
})
export class TemplateCreationDialogComponent implements OnInit {
  constructor(
    private listService: ListService,
    private dialog: MdDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) {
  }

  public ngOnInit() {
    const viewMode = this.storageService.read('templateDisplayMode') || 'Template';

    this.dialog.open(TemplateCreationComponent, {
      data: { mode: viewMode },
      disableClose: true,
      width: '720px'
    }).afterClosed()
      .subscribe(templateData => {
        if (templateData) {
          this.listService.onUpdate.emit(templateData);
        }
        this.router.navigate(['../'], {
          preserveQueryParams: true,
          relativeTo: this.activatedRoute
        });
      });
  }
}
