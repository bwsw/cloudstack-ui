import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BaseTemplateModel, resourceType } from '../../../template/shared';
import { TemplateFilterListComponent } from '../../../template/template-filter-list/template-filter-list.component';
import { AuthService } from '../../../shared/services/auth.service';
import { OsFamily } from '../../../shared/models';
import { ImageGroup } from '../../../shared/models/';

@Component({
  selector: 'cs-vm-creation-template-dialog',
  templateUrl: 'vm-template-dialog.component.html',
})
export class VmTemplateDialogComponent extends TemplateFilterListComponent implements OnInit {
  @Input()
  public templates: BaseTemplateModel[];
  @Input()
  public selectedTypes: string[];
  @Input()
  public selectedOsFamilies: OsFamily[];
  @Input()
  public selectedGroups: string[];
  @Input()
  public viewMode: string;
  @Input()
  public query: string;
  @Input()
  public groups: ImageGroup[];
  @Input()
  public isLoading: boolean;
  @Input()
  public preselectedTemplate: BaseTemplateModel;
  @Input()
  public sidebarWidth: number;

  @Output()
  public viewModeChange = new EventEmitter<string>();
  @Output()
  public selectedTypesChange = new EventEmitter<string[]>();
  @Output()
  public selectedOsFamiliesChange = new EventEmitter<string[]>();
  @Output()
  public selectedGroupsChange = new EventEmitter<string[]>();
  @Output()
  public queryChange = new EventEmitter<string>();
  @Output()
  public cancel = new EventEmitter<boolean>();
  @Output()
  public selectionChange = new EventEmitter<BaseTemplateModel>();

  public selectedTemplate: BaseTemplateModel;

  constructor(translate: TranslateService, authService: AuthService) {
    super(translate, authService);
  }

  public ngOnInit() {
    this.selectedTemplate = this.preselectedTemplate;
  }

  public onSelectedTemplateChange(template: BaseTemplateModel) {
    this.selectedTemplate = template;
  }

  public isSubmitButtonDisabled() {
    const isTemplateNotSelected = !this.selectedTemplate;
    const isNoTemplatesInCurrentViewMode = !this.templates.length;
    const isSelectedTemplateFromDifferentViewMode =
      this.selectedTemplate && resourceType(this.selectedTemplate) !== this.viewMode;
    return (
      isTemplateNotSelected ||
      isNoTemplatesInCurrentViewMode ||
      isSelectedTemplateFromDifferentViewMode
    );
  }
}
