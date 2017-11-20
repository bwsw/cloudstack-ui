import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { TemplateGroupSelectorComponent } from './template-group-selector/template-group-selector.component';
import { TemplateGroupService } from '../../../shared/services/template-group.service';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../../shared/services/language.service';
import { TemplateTagKeys } from '../../../shared/services/tags/template-tag-keys';

export const DefaultTemplateGroupId = 'general';

@Component({
  selector: 'cs-template-group',
  templateUrl: 'template-group.component.html',
  styleUrls: ['template-group.component.scss']
})
export class TemplateGroupComponent {
  @Input() public template: BaseTemplateModel;
  @Input() public groups: any;
  @Output() public groupChange = new EventEmitter<BaseTemplateModel>();

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
  }

  public get groupName(): string {
    const tag = this.template.tags.find(_ => _.key === TemplateTagKeys.group);
    const group = tag && this.groups[tag.value];
    return group && ((group.translations && group.translations[this.locale]) || group.id);
  }

  public get isInDefaultGroup(): boolean {
    return this.template.templateGroupId && this.template.templateGroupId === DefaultTemplateGroupId;
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public changeGroup(): void {
    this.dialog.open(TemplateGroupSelectorComponent, {
      width: '380px',
      data: {
        template: this.template,
        groups: this.groups
      }
    }).afterClosed().subscribe((template) => {
      if (template) {
        this.groupChange.emit(template);
      }
    });
  }
}
