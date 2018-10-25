import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import { BaseTemplateAction } from '../base-template-action';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-template-actions',
  templateUrl: 'template-actions.component.html',
})
export class TemplateActionsComponent {
  @Input()
  public template: BaseTemplateModel;
  @Input()
  public actions: BaseTemplateAction[];
  @Output()
  public deleteTemplate = new EventEmitter<BaseTemplateModel>();

  constructor(private dialogService: DialogService) {}

  public activateAction(action) {
    switch (action.icon) {
      case 'mdi-delete': {
        const confirmMessage = 'DIALOG_MESSAGES.TEMPLATE.CONFIRM_DELETION';
        this.dialogService.confirm({ message: confirmMessage }).subscribe(res => {
          if (res) {
            this.deleteTemplate.emit(this.template);
          }
        });
        break;
      }
      default:
        break;
    }
  }
}
