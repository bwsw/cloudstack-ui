import { BaseTemplateModel } from '../../shared/base-template.model';
import { BaseTemplateService } from '../../shared/base-template.service';
import { ActivatedRoute } from '@angular/router';
import { TemplateActionsService } from '../../shared/template-actions.service';
import { ListService } from '../../../shared/components/list/list.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TemplateTagKeys } from '../../../shared/services/tags/template-tag-keys';

export abstract class BaseTemplateDetailsComponent implements OnInit {
  public entity: BaseTemplateModel;
  public templateDownloadUrl: string;
  private service: BaseTemplateService;

  constructor(
    service: BaseTemplateService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    protected templateActions: TemplateActionsService,
    protected listService: ListService,
  ) {
    this.service = service;
  }

  public ngOnInit(): void {
    const params = this.route.snapshot.parent.params;
    this.loadEntity(params.id).subscribe(entity => this.entity = entity);
  }

  public get templateTypeTranslationToken(): string {
    const type = this.entity && (this.entity as any).type || '';
    const templateTypeTranslations = {
      'BUILTIN': 'Built-in',
      'USER': 'User'
    };

    return templateTypeTranslations[type];
  }

  public remove(): void {
    this.templateActions.removeTemplate(this.entity).subscribe(() => {
      this.listService.onUpdate.emit(this.entity);
    });
  }

  public onCopySuccess(): void {
    this.notificationService.message('COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('COPY_FAIL');
  }

  protected loadEntity(id: string): Observable<BaseTemplateModel> {
    return this.service.get(id)
      .switchMap(template => {
        if (template) {
          return Observable.of(template);
        } else {
          return Observable.throw('ENTITY_DOES_NOT_EXIST');
        }
      })
      .do(template => {
        const downloadUrlTag = template.tags.find(
          tag => tag.key === TemplateTagKeys.downloadUrl
        );
        if (downloadUrlTag) {
          this.templateDownloadUrl = downloadUrlTag.value;
        }
      });
  }
}
