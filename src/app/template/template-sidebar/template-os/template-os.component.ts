import { Component, Input, OnInit } from '@angular/core';

import { BaseTemplateModel } from '../../shared';
import { OsType } from '../../../shared/models';
import { NgrxEntities } from '../../../shared/interfaces';

@Component({
  selector: 'cs-template-os',
  templateUrl: 'template-os.component.html',
})
export class TemplateOsComponent implements OnInit {
  @Input()
  public template: BaseTemplateModel;
  @Input()
  public osTypes: NgrxEntities<OsType>;
  public templateOsType: OsType;

  public ngOnInit() {
    this.templateOsType = this.osTypes[this.template.ostypeid];
  }
}
