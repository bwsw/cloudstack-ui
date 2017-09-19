import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ListService } from '../../shared/components/list/list.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { BaseTemplateModel, Iso, IsoService, Template, TemplateService } from '../shared';
import { TemplateFilters } from '../shared/base/template-filters';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  providers: [ListService]
})
export class TemplatePageComponent implements OnInit {
  public templates: Array<Template>;
  public isos: Array<Iso>;
  public viewMode: string;

  constructor(
    private storageService: LocalStorageService,
    public listService: ListService,
    private templateService: TemplateService,
    private isoService: IsoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.viewMode = this.storageService.read('templateDisplayMode') || 'Template';
    this.subscribeToTemplateCreations();
    this.subscribeToTemplateDeletions();
    this.getTemplates();
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
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
      this.templateService.getGroupedTemplates({}, filters, true)
        .map(_ => _.toArray()),
      this.isoService.getGroupedTemplates({}, filters, true).map(_ => _.toArray())
    )
      .subscribe(([templates, isos]) => {
        this.templates = templates;
        this.isos = isos;
      });
  }

  private subscribeToTemplateCreations(): void {
    Observable.merge(
      this.templateService.onTemplateCreated,
      this.isoService.onTemplateCreated
    )
      .subscribe(template => this.updateList(template));
  }

  private subscribeToTemplateDeletions(): void {
    Observable.merge(
      this.templateService.onTemplateRemoved,
      this.isoService.onTemplateRemoved
    )
      .subscribe(template => this.updateList(template));
  }
}
