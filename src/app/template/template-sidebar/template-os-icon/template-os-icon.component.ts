import { Component, Input, OnInit } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { OsType } from '../../../shared/models/os-type.model';


@Component({
  selector: 'cs-template-os-icon',
  templateUrl: 'template-os-icon.component.html',
  styleUrls: ['template-os-icon.component.scss']
})
export class TemplateOsIconComponent implements OnInit {
  @Input() public template: BaseTemplateModel;
  @Input() public osTypes: Array<OsType>;
  public templateOsType: OsType;

  public ngOnInit() {
    this.templateOsType = this.osTypes.find(_ => _.id === this.template.osTypeId);
  }

}
