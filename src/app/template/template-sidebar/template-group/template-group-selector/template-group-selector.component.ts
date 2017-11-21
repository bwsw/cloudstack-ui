import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseTemplateModel } from '../../../shared/base-template.model';
import { TemplateGroupService } from '../../../../shared/services/template-group.service';
import { Mode } from '../../../../shared/components/create-update-delete-dialog/create-update-delete-dialog.component';
import { TemplateGroup } from '../../../../shared/models/template-group.model';
import { TranslateService } from '@ngx-translate/core';
import { DefaultTemplateGroupId } from '../template-group.component';
import { Language } from '../../../../shared/services/language.service';
import { TemplateTagKeys } from '../../../../shared/services/tags/template-tag-keys';
import { Tag } from '../../../../shared/models/tag.model';
import { Observable } from 'rxjs/Observable';
import { getTemplateGroupId } from '../../../template-filter-list/template-filter-list.component';


@Component({
  selector: 'cs-template-group-selector',
  templateUrl: 'template-group-selector.component.html',
  styleUrls: ['template-group-selector.component.scss']
})
export class TemplateGroupSelectorComponent implements OnInit {
  @Input() public template: BaseTemplateModel;
  @Input() public groups: TemplateGroup[];
  public groupNames: Array<string> = [];
  public loading: boolean;
  public modes = Mode;

  @Output() public groupChange = new EventEmitter();
  @Output() public groupReset = new EventEmitter();
  @Output() public cancel = new EventEmitter();

  constructor(
    private templateGroupService: TemplateGroupService,
    private translate: TranslateService
  ) {
  }

  public ngOnInit() {
    this.loadGroups();
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public get groupName(): string {
    const group = this.groups[getTemplateGroupId(this.template)];
    return group && ((group.translations && group.translations[this.locale]) || group.id);
  }

  public changeGroup(translation) {
    this.loading = true;
    const templateGroup = Object.values(this.groups).find(group =>
      (group.translations && group.translations[this.locale] === translation)
      || group.id === translation);
    this.groupChange.emit({ template: this.template, templateGroup });
  }

  public resetGroup(): void {
    this.groupReset.emit(this.template);
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  private loadGroups(): void {
    Object.values(this.groups).forEach(group => {
      this.groupNames.push(group.translations
        ? group.translations[this.locale]
        : group.id);
    });
  }
}
