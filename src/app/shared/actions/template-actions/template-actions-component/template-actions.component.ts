import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import { BaseTemplateAction } from '../base-template-action';


@Component({
  selector: 'cs-template-actions',
  templateUrl: 'template-actions.component.html'
})
export class TemplateActionsComponent {
  @Input() public template: BaseTemplateModel;
  @Input() public actions: Array<BaseTemplateAction>;
  @Output() public deleteTemplate = new EventEmitter<BaseTemplateModel>();

  public activateAction(action) {
    switch (action.icon) {
      case 'delete': {
        this.deleteTemplate.emit(this.template);
      }
    }
  }
}
