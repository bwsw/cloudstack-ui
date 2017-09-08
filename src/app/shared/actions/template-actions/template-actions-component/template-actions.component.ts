import { Component, Input, OnInit } from '@angular/core';
import { BaseTemplateModel } from '../../../../template/shared/base/base-template.model';
import { IsoActionsService } from '../iso-actions.service';
import { TemplateActionsService } from '../template-actions.service';
import { BaseTemplateAction } from '../base-template-action';


@Component({
  selector: 'cs-template-actions',
  templateUrl: 'template-actions.component.html'
})
export class TemplateActionsComponent implements OnInit {
  @Input() public template: BaseTemplateModel;
  public actions: Array<BaseTemplateAction>;

  constructor(
    private templateActionsService: TemplateActionsService,
    private isoActionsService: IsoActionsService
  ) {}

  public ngOnInit(): void {
    if (this.template.isTemplate) {
      this.actions = this.templateActionsService.actions;
    } else {
      this.actions = this.isoActionsService.actions;
    }
  }
}
