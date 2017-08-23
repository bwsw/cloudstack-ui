import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Router } from '@angular/router';
import { TemplateCreationComponent } from './template-creation.component';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { TemplateService } from '../shared/template.service';

@Component({
  selector: 'cs-template-create-dialog',
  template: ``
})
export class TemplateCreationDialogComponent implements OnInit {
  constructor(
    private templateService: TemplateService,
    private dialogService: DialogService,
    private router: Router,
    private storageService: LocalStorageService
  ) {
  }

  ngOnInit() {
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
          this.templateService.onCreation.next(templateData);
        }

        this.router.navigate(['/templates']);
      });
  }
}
