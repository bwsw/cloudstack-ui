import { Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TemplateActionsService } from '../shared/template-actions.service';
import { ListService } from '../../shared/components/list/list.service';
import { BaseTemplateService } from '../shared/base-template.service';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';


export abstract class BaseTemplateSidebarComponent implements OnInit {
  @Input() public template: BaseTemplateModel;
  public readyInEveryZone: boolean;
  public updating: boolean;

  private service: BaseTemplateService;

  constructor(
    service: BaseTemplateService,
    public dateTimeFormatterService: DateTimeFormatterService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    protected templateActions: TemplateActionsService,
    protected listService: ListService,
  ) {
    this.service = service;
  }

  public ngOnInit(): void {
    this.route.params.pluck('id').filter(id => !!id).subscribe((id: string) => {
      this.service.getWithGroupedZones(id).subscribe(template => {
        this.template = template;
        this.checkZones();
      });
    });
  }

  public get templateTypeTranslationToken(): string {
    const type = this.template && (this.template as any).type || '';
    const templateTypeTranslations = {
      'BUILTIN': 'Built-in',
      'USER': 'User'
    };

    return templateTypeTranslations[type];
  }

  public remove(): void {
    this.templateActions.removeTemplate(this.template).subscribe(() => {
      this.listService.onUpdate.emit(this.template);
    });
  }

  public updateStatus(): void {
    if (this.template) {
      this.updating = true;
      this.service.getWithGroupedZones(this.template.id, null, false)
        .finally(() => this.updating = false)
        .subscribe(
          template => {
            this.template = template;
            this.checkZones();
          },
          error => this.dialogService.alert(error.message)
        );
    }
  }

  private checkZones(): void {
    this.readyInEveryZone = this.template.zones.every(template => template.isReady);
  }

  public onCopySuccess(): void {
    this.notificationService.message('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('CLIPBOARD.COPY_FAIL');
  }
}
