import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OsFamily } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { AuthService } from '../../shared/services/auth.service';
import { BaseTemplateModel } from '../shared/base-template.model';

@Component({
  selector: 'cs-template-filter-list-selector',
  templateUrl: 'template-filter-list-selector.component.html',
  styleUrls: ['template-filter-list-selector.component.scss'],
})
export class TemplateFilterListSelectorComponent {
  @Input()
  public templates: BaseTemplateModel[];
  @Input()
  public dialogMode = true;
  @Input()
  public showIsoSwitch = true;
  @Input()
  public viewMode: string;
  @Input()
  public zoneId: string;
  @Input()
  public groupings: any;
  @Input()
  public groups: any;
  @Input()
  public fetching;
  @Input()
  public query: string;
  @Input()
  public selectedTypes: string[];
  @Input()
  public selectedOsFamilies: OsFamily[];
  @Input()
  public selectedZones: Zone[];
  @Input()
  public selectedGroups: string[];
  @Input()
  public selectedGroupings;

  @Output()
  public selectedTemplateChange = new EventEmitter();
  @Output()
  public viewModeChange = new EventEmitter();
  @Output()
  public queryChanged = new EventEmitter();
  @Output()
  public selectedTypesChanged = new EventEmitter();
  @Output()
  public selectedGroupsChanged = new EventEmitter();
  @Output()
  public selectedOsFamiliesChanged = new EventEmitter();

  @Input()
  public set selectedTemplate(template: BaseTemplateModel) {
    this._selectedTemplate = template
      ? template
      : this.templates && this.templates.length
        ? this.templates[0]
        : null;
  }

  // tslint:disable-next-line:variable-name
  private _selectedTemplate: BaseTemplateModel;

  public get selectedTemplate(): BaseTemplateModel {
    return this._selectedTemplate;
  }

  constructor(protected authService: AuthService) {}

  public selectTemplate(template: BaseTemplateModel): void {
    this.selectedTemplate = template;
    this.selectedTemplateChange.emit(this.selectedTemplate);
  }
}
