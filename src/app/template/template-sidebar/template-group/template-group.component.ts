import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { TemplateGroupSelectorComponent } from './template-group-selector/template-group-selector.component';
import { TemplateGroupService } from '../../../shared/services/template-group.service';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../../shared/services/language.service';

export const DefaultTemplateGroupId = 'general';

@Component({
  selector: 'cs-template-group',
  templateUrl: 'template-group.component.html',
  styleUrls: ['template-group.component.scss']
})
export class TemplateGroupComponent {
  @Input() public template: BaseTemplateModel;
  @Input() public groups: any;
  @Output() public groupChange = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private templateGroupService: TemplateGroupService,
    private translate: TranslateService
  ) {
  }

  public get groupName(): string {
    if (this.template.templateGroupId) {
      const group = this.groups[this.template.templateGroupId];
      return group
        && ((group.translations && group.translations[this.locale])
          || group.id);
    } else {
      this.templateGroupService.add(this.template, { id: DefaultTemplateGroupId });
    }
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
    }).afterClosed().subscribe(() => this.groupChange.emit());
  }
}
