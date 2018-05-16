import { Component, Input } from '@angular/core';

import { BaseTemplateModel } from '../../shared/base-template.model';
import { OsType } from '../../../shared/models';
import { NgrxEntities } from '../../../shared/interfaces';


@Component({
  selector: 'cs-template-os-icon',
  templateUrl: 'template-os-icon.component.html',
  styleUrls: ['template-os-icon.component.scss']
})
export class TemplateOsIconComponent {
  @Input() public template: BaseTemplateModel;
  @Input() public osTypes: NgrxEntities<OsType>;

  public get templateOsType(): any {
    return this.osTypes[this.template.osTypeId];
  }
}
