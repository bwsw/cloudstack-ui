import { Injectable } from '@angular/core';
import { ActionsService } from '../../shared/interfaces/action-service.interface';
import { Action } from '../../shared/interfaces/action.interface';
import { Template } from '../shared/template.model';
import { TemplateDeleteAction } from './delete/template-delete';


@Injectable()
export class TemplateActionsService implements ActionsService<Template, Action<Template>> {
  public actions = [this.templateDeleteAction];

  constructor(public templateDeleteAction: TemplateDeleteAction) {}
}
