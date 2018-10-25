import { Component, Input, OnInit } from '@angular/core';
import { State } from '../../../../reducers/index';
import { Store } from '@ngrx/store';
import { BaseTemplateModel, isTemplate } from '../../../../template/shared/base-template.model';
import { BaseTemplateAction } from '../base-template-action';

import * as templateActions from '../../../../reducers/templates/redux/template.actions';
import { TemplateActionsService } from '../template-actions.service';
import { IsoActionsService } from '../iso-actions.service';

@Component({
  selector: 'cs-template-actions-container',
  template: `
    <cs-template-actions
      [template]="template"
      [actions]="actions"
      (deleteTemplate)="deleteTemplate($event)"
    ></cs-template-actions>`,
})
export class TemplateActionsContainerComponent implements OnInit {
  @Input()
  public template: BaseTemplateModel;
  public actions: BaseTemplateAction[] = [];

  constructor(
    private store: Store<State>,
    private templateActionsService: TemplateActionsService,
    private isoActionsService: IsoActionsService,
  ) {}

  public ngOnInit() {
    this.actions =
      this.template && isTemplate(this.template)
        ? this.templateActionsService.actions
        : this.isoActionsService.actions;
  }

  public deleteTemplate(template: BaseTemplateModel) {
    this.store.dispatch(new templateActions.RemoveTemplate(template));
  }
}
