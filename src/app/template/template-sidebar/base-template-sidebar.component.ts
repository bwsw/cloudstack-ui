import { Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TemplateActionsService } from '../shared/template-actions.service';
import { ListService } from '../../shared/components/list/list.service';
import { BaseTemplateService, DOWNLOAD_URL } from '../shared/base-template.service';

export abstract class BaseTemplateSidebarComponent implements OnInit {
  @Input() public template: BaseTemplateModel;
  public templateDownloadUrl: string;
  private service: BaseTemplateService;

  constructor(
    service: BaseTemplateService,
    protected templateActions: TemplateActionsService,
    protected listService: ListService,
    private route: ActivatedRoute,
  ) {
    this.service = service;
  }

  public ngOnInit(): void {
    this.route.params.pluck('id').subscribe((id: string) => {
      if (id) {
        this.service.get(id).subscribe(template => {
          this.template = template;
          const downloadUrlTag = this.template.tags.find(
            tag => tag.key === DOWNLOAD_URL
          );
          if (downloadUrlTag) {
            this.templateDownloadUrl = downloadUrlTag.value;
          }
        });
      }
    });
  }

  public remove(): void {
    this.templateActions.removeTemplate(this.template).subscribe(() => {
      this.listService.onDelete.emit(this.template);
    });
  }
}
