import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../shared/services/auth.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TemplateTagKeys } from '../../shared/services/tags/template-tag-keys';
import { BaseTemplateModel } from '../shared/base-template.model';
import { BaseTemplateService } from '../shared/base-template.service';


export abstract class BaseTemplateSidebarComponent extends SidebarComponent<BaseTemplateModel> {
  public templateDownloadUrl: string;
  public readyInEveryZone: boolean;
  public updating: boolean;
  private service: BaseTemplateService;

  constructor(
    service: BaseTemplateService,
    public authService: AuthService,
    public dateTimeFormatterService: DateTimeFormatterService,
    private dialogService: DialogService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected listService: ListService,
    protected notificationService: NotificationService
  ) {
    super(service, notificationService, route, router);
    this.service = service;
  }

  public get isSelf(): boolean {
    return this.authService.username === this.entity.account;
  }

  public get templateTypeTranslationToken(): string {
    const type = this.entity && (this.entity as any).type || '';
    const templateTypeTranslations = {
      'BUILTIN': 'Built-in',
      'USER': 'User'
    };

    return templateTypeTranslations[type];
  }

  public updateStatus(): void {
    if (this.entity) {
      this.updating = true;
      this.service.getWithGroupedZones(this.entity.id, null, false)
        .finally(() => this.updating = false)
        .subscribe(
          template => {
            this.entity = template;
            this.checkZones(template);
          },
          error => this.dialogService.alert({ message: error.message })
        );
    }
  }

  public onCopySuccess(): void {
    this.notificationService.message('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('CLIPBOARD.COPY_FAIL');
  }

  private checkZones(template: BaseTemplateModel): void {
    this.readyInEveryZone = template && template.zones.every(_ => _.isReady);
  }

  protected loadEntity(id: string): Observable<BaseTemplateModel> {
    return this.service.getWithGroupedZones(id)
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
        this.checkZones(template);
      });
  }
}
