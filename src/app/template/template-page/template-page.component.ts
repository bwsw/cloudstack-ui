import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { BaseTemplateModel, Iso, IsoService, Template, TemplateService } from '../shared';
import { TemplateFilters } from '../shared/base-template.service';
import { TemplateCreationComponent } from '../template-creation/template-creation.component';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  providers: [ListService]
})
export class TemplatePageComponent implements OnInit {
  @HostBinding('class.detail-list-container') public detailListContainer = true;
  public templates: Array<Template>;
  public isos: Array<Iso>;
  public viewMode: string;

  constructor(
    private dialogService: DialogService,
    private storageService: LocalStorageService,
    private listService: ListService,
    private templateService: TemplateService,
    private isoService: IsoService
  ) {}

  public ngOnInit(): void {
    this.viewMode = this.storageService.read('templateDisplayMode') || 'Template';
    this.listService.onAction.subscribe(() => this.showCreationDialog());
    this.listService.onDelete.subscribe((template) => this.updateList(template));
    this.subscribeToTemplateDeletions();
    this.getTemplates();
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      classes: 'template-creation-dialog dialog-overflow-visible',
      providers: [{ provide: 'mode', useValue: this.viewMode }],
      clickOutsideToClose: false
    })
      .switchMap(res => res.onHide())
      .subscribe(templateData => {
        if (templateData) {
          this.updateList();
        }
      });
  }

  private updateList(template?: BaseTemplateModel): void {
    this.getTemplates();
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

  private subscribeToTemplateDeletions(): void {
    Observable.merge(
      this.templateService.onTemplateRemoved,
      this.isoService.onTemplateRemoved
    )
      .subscribe(template => this.updateList(template));
  }
}
