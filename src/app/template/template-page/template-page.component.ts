import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseTemplateModel } from '../shared/base-template.model';
import { Iso } from '../shared/iso.model';
import { ListService } from '../../shared/components/list/list.service';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  providers: [ListService]
})
export class TemplatePageComponent {
  @Input() public templates: Array<BaseTemplateModel>;
  @Input() public isLoading: boolean;
  // @Input() public isos: Array<Iso>;
  @Input() public viewMode: string;
  @Input() public groupings: object[];
  @Output() public onViewModeChange = new EventEmitter<string>();
  @Output() public onFiltersChange = new EventEmitter();
  @Output() public onQueryChange = new EventEmitter();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public listService: ListService
  ) {
  }

  // public ngOnInit(): void {
  // this.viewMode = this.storageService.read('templateDisplayMode') || 'Template';
  // this.listService.onUpdate.subscribe((template) => this.updateList(template));
  // this.subscribeToTemplateDeletions();
  // this.getTemplates();
  // }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  // private updateList(template?: BaseTemplateModel): void {
  //   this.getTemplates();
  //   if (template && this.listService.isSelected(template.id)) {
  //     this.listService.deselectItem();
  //   }
  // }

  // private getTemplates(): void {
  //   let filters = [
  //     TemplateFilters.featured,
  //     TemplateFilters.self
  //   ];
  //
  //   if (this.authService.isAdmin()) {
  //     filters = [TemplateFilters.all];
  //   }
  //
  //   Observable.forkJoin(
  //     this.templateService.getGroupedTemplates<Template>({}, filters, true)
  //       .map(_ => _.toArray()),
  //     this.isoService.getGroupedTemplates<Iso>({}, filters, true).map(_ => _.toArray())
  //   )
  //     .subscribe(([templates, isos]) => {
  //       this.templates = templates;
  //       this.isos = isos;
  //     });
  // }

  // private subscribeToTemplateDeletions(): void {
  //   Observable.merge(
  //     this.templateService.onTemplateRemoved,
  //     this.isoService.onTemplateRemoved
  //   )
  //     .subscribe(template => this.updateList(template));
  // }
}
