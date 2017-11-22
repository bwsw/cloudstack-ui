import { Component, Input, OnInit } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { OsType } from '../../../shared/models/os-type.model';

import { Dictionary } from '@ngrx/entity/src/models';


@Component({
  selector: 'cs-template-os-icon',
  templateUrl: 'template-os-icon.component.html',
  styleUrls: ['template-os-icon.component.scss']
})
export class TemplateOsIconComponent {
  @Input() public template: BaseTemplateModel;
  @Input() public osTypes: Dictionary<OsType>;

  public get templateOsType(): any {
    return this.osTypes[this.template.osTypeId];
  }
}
