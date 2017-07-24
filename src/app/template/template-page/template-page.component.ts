import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ListService } from '../../shared/components/list/list.service';

import { StorageService } from '../../shared/services/storage.service';
import { BaseTemplateModel, Iso, IsoService, Template, TemplateService } from '../shared';
import { TemplateFilters } from '../shared/base-template.service';
import { TemplateActionsService } from '../shared/template-actions.service';
import { TemplateCreationComponent } from '../template-creation/template-creation.component';
import { TemplateFilterListComponent } from '../template-filter-list/template-filter-list.component';
import { MdDialog } from '@angular/material';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  providers: [ListService]
})
export class TemplatePageComponent implements OnInit {
  public templates: Array<Template>;
  public isos: Array<Iso>;
  public viewMode: string;

  @HostBinding('class.detail-list-container') public detailListContainer = true;
  @ViewChild(TemplateFilterListComponent) private filterList;

  constructor(
    private dialog: MdDialog,
    private dialogService: DialogService,
    private storageService: StorageService,
    private listService: ListService,
    private templateActions: TemplateActionsService,
    private templateService: TemplateService,
    private isoService: IsoService
  ) {}

  public ngOnInit(): void {
    this.viewMode = this.storageService.read('templateDisplayMode') || 'Template';
    this.listService.onAction.subscribe(() => this.showCreationDialog());
    this.listService.onDelete.subscribe((template) => this.updateList(template));
    this.getTemplates();
  }

  public showCreationDialog(): void {
    this.dialog.open(TemplateCreationComponent, {
      data: { mode: this.viewMode },
      disableClose: true,
      panelClass: 'template-creation-dialog'
    })
      .afterClosed()
      .subscribe(templateData => {
        if (templateData) {
          this.updateList();
        }
      });
  }

  public createTemplate(templateData): void {
    this.templateActions.createTemplate(templateData, this.viewMode)
      .subscribe(
        () => this.updateList(),
        () => {}
      );
  }

  public removeTemplate(template: BaseTemplateModel): void {
    this.templateActions.removeTemplate(template)
      .subscribe(
        () => this.updateList(template),
        () => {}
      );
  }

  private updateList(template?: BaseTemplateModel): void {
    this.filterList.updateList();
    if (template && this.listService.isSelected(template.id)) {
      this.listService.deselectItem();
    }
  }

  private getTemplates(): void {
    const filters = [
      TemplateFilters.featured,
      TemplateFilters.self
    ];

    Observable.forkJoin(
      this.templateService.getGroupedTemplates<Template>({}, filters, true).map(_ => _.toArray()),
      this.isoService.getGroupedTemplates<Iso>({}, filters, true).map(_ => _.toArray())
    )
      .subscribe(([templates, isos]) => {
        this.templates = templates;
        this.isos = isos;
      });
  }
}
