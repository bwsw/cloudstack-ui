import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TemplateActionsService } from '../shared/template-actions.service';
import { ListService } from '../../shared/components/list/list.service';


@Component({
  selector: 'cs-base-template-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class BaseTemplateSidebarComponent {
  @Input() public template: BaseTemplateModel;

  constructor(
    protected templateActions: TemplateActionsService,
    protected listService: ListService
  ) {}

  public remove(): void {
    this.templateActions.removeTemplate(this.template).subscribe(() => {
      this.listService.onDelete.emit(this.template);
    });
  }
}
