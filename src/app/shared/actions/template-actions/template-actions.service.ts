import { Injectable } from '@angular/core';
import { ActionsService } from '../../interfaces/action-service.interface';
import { Action } from '../../interfaces/action.interface';
import { Template } from '../../../template/shared/template.model';
import { TemplateDeleteAction } from './delete/template-delete';

@Injectable()
export class TemplateActionsService implements ActionsService<Template, Action<Template>> {
  public actions = [this.templateDeleteAction];

  constructor(public templateDeleteAction: TemplateDeleteAction) {}
}
