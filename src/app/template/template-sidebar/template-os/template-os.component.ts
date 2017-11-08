import { Component, Input, OnInit } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { OsType } from '../../../shared/models/os-type.model';


@Component({
  selector: 'cs-template-os',
  templateUrl: 'template-os.component.html'
})
export class TemplateOsComponent implements OnInit {
  @Input() public template: BaseTemplateModel;
  @Input() public osTypes: Array<OsType>;
  public templateOsType: OsType;

  public ngOnInit() {
    this.templateOsType = this.osTypes[this.template.osTypeId];
  }
}
