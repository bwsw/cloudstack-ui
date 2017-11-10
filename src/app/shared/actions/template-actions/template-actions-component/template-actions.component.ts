import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import { IsoActionsService } from '../iso-actions.service';
import { TemplateActionsService } from '../template-actions.service';
import { BaseTemplateAction } from '../base-template-action';
import { TemplateDeleteAction } from '../delete/template-delete';
import { IsoDeleteAction } from '../delete/iso-delete';


@Component({
  selector: 'cs-template-actions',
  templateUrl: 'template-actions.component.html'
})
export class TemplateActionsComponent implements OnInit {
  @Input() public template: BaseTemplateModel;
  @Output() public deleteTemplate = new EventEmitter<BaseTemplateModel>();
  public actions: Array<BaseTemplateAction>;

  constructor(
    private templateActionsService: TemplateActionsService,
    private isoActionsService: IsoActionsService
  ) {
  }

  public ngOnInit(): void {
    if (this.template.isTemplate) {
      this.actions = this.templateActionsService.actions;
    } else {
      this.actions = this.isoActionsService.actions;
    }
  }

  public activateAction(action) {
    action.activate(this.template).subscribe(() => {
      if (action instanceof TemplateDeleteAction || action instanceof IsoDeleteAction) {
        this.deleteTemplate.emit(this.template);
      }
    });
  }
}
