import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { OsFamily } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { AuthService } from '../../shared/services/auth.service';
import { BaseTemplateModel } from '../shared/base-template.model';
import { Template } from '../shared/template.model';


@Component({
  selector: 'cs-template-filter-list-selector',
  templateUrl: 'template-filter-list-selector.component.html',
  styleUrls: ['template-filter-list-selector.component.scss']
})
export class TemplateFilterListSelectorComponent {
  @Input() public templates: Array<Template>;
  @Input() public selectedTemplate: BaseTemplateModel;

  @Input() public dialogMode = true;
  @Input() public showIsoSwitch = true;
  @Input() public viewMode: string;

  @Input() public fetching;
  @Input() public query: string;
  @Input() public selectedTypes: Array<string>;
  @Input() public selectedOsFamilies: Array<OsFamily>;
  @Input() public selectedZones: Array<Zone>;
  @Input() public selectedGroupings;


  @Output() public selectedTemplateChange = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();
  @Output() public onQueryChange = new EventEmitter();
  @Output() public onSelectedTypesChange = new EventEmitter();
  @Output() public onSelectedOsFamiliesChange = new EventEmitter();

  public groupings = [
    {
      key: 'zones',
      label: 'GROUP_BY_ZONES',
      selector: (item: BaseTemplateModel) => item.zoneId || '',
      name: (item: BaseTemplateModel) => item.zoneName || 'NO_ZONE'
    }
  ];

  constructor(protected authService: AuthService) {
  }


  public selectTemplate(template: BaseTemplateModel): void {
    this.selectedTemplate = template;
    this.selectedTemplateChange.emit(this.selectedTemplate);
  }
}
