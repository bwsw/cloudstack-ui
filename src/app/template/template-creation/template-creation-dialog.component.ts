import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
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
    private dialogService: DialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) {
  }

  public ngOnInit() {
    const viewMode = this.storageService.read('templateDisplayMode') || 'Template';

    this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      classes: 'template-creation-dialog dialog-overflow-visible',
      providers: [{ provide: 'mode', useValue: viewMode }],
      clickOutsideToClose: false
    })
      .switchMap(res => res.onHide())
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
