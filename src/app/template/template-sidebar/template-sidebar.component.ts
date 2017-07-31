import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../shared';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';
import { TemplateActionsService } from '../shared/template-actions.service';
import { ListService } from '../../shared/components/list/list.service';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'cs-template-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class TemplateSidebarComponent extends BaseTemplateSidebarComponent {
  constructor(
    templateService: TemplateService,
    route: ActivatedRoute,
    templateActions: TemplateActionsService,
    listService: ListService,
    dialogService: DialogService,
    notificationService: NotificationService
  ) {
    super(templateService, templateActions, listService, route, dialogService, notificationService);
  }
}
