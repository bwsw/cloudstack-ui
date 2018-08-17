import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { BaseTemplateModel } from '../../shared/base-template.model';
import { TemplateTagKeys } from '../../../shared/services/tags/template-tag-keys';
import { TemplateGroupSelectorContainerComponent } from './containers/template-group-selector.container';
import { DefaultTemplateGroupId, TemplateGroup } from '../../../shared/models';
import { Language } from '../../../shared/types';


@Component({
  selector: 'cs-template-group',
  templateUrl: 'template-group.component.html',
  styleUrls: ['template-group.component.scss']
})
export class TemplateGroupComponent {
  @Input() public template: BaseTemplateModel;
  @Input() public groups: TemplateGroup[];
  @Output() public groupChange = new EventEmitter<BaseTemplateModel>();
  @Output() public groupReset = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
  }

  public get groupsLoaded(): boolean {
    return !!Object.entries(this.groups).length;
  }

  public get groupName(): string {
    const tag = this.template.tags.find(_ => _.key === TemplateTagKeys.group);
    const group = tag && this.groups[tag.value];
    return group && ((group.translations && group.translations[this.locale]) || group.id) || DefaultTemplateGroupId;
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public changeGroup(): void {
    this.dialog.open(TemplateGroupSelectorContainerComponent, {
      width: '380px',
      data: {}
    });
  }
}
