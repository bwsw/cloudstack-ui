import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel } from '../../../shared/base-template.model';
import { TemplateGroupService } from '../../../../shared/services/template-group.service';
import { Mode } from '../../../../shared/components/create-update-delete-dialog/create-update-delete-dialog.component';
import { TemplateGroup } from '../../../../shared/models/template-group.model';
import { TranslateService } from '@ngx-translate/core';
import { DefaultTemplateGroupId } from '../template-group.component';
import { Language } from '../../../../shared/services/language.service';


@Component({
  selector: 'cs-template-group-selector',
  templateUrl: 'template-group-selector.component.html',
  styleUrls: ['template-group-selector.component.scss']
})
export class TemplateGroupSelectorComponent implements OnInit {
  public template: BaseTemplateModel;
  public groups: any;
  public groupNames: Array<string> = [];
  public groupNames$: Observable<Array<string>>;
  public loading: boolean;
  public modes = Mode;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { template: BaseTemplateModel, groups: Array<TemplateGroup> },
    public dialogRef: MatDialogRef<TemplateGroupSelectorComponent>,
    private templateGroupService: TemplateGroupService,
    private translate: TranslateService
  ) {
    this.template = data.template;
    this.groups = data.groups;
  }

  public ngOnInit() {
    this.loadGroups();
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public get groupName(): string {
    const group = this.groups[this.template.templateGroupId];
    return group && ((group.translations && group.translations[this.locale]) || group.id);
  }

  public get isInDefaultGroup(): boolean {
    return this.template.templateGroupId === DefaultTemplateGroupId;
  }

  public changeGroup(translation): void {
    this.loading = true;
    let templateGroup;
    for (const key in this.groups) {
      const group = this.groups[key];

      if ((group.translations && group.translations[this.locale] === translation) || group.id === translation) {
        templateGroup = group;
        this.loading = false;
      }
    }
    this.templateGroupService.add(this.template, templateGroup)
      .finally(() => this.dialogRef.close())
      .subscribe();
  }

  public removeGroup(): void {
    this.changeGroup(DefaultTemplateGroupId);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private loadGroups(): void {
    this.loading = true;
    for (const key in this.groups) {
      const group = this.groups[key];

      if (group.id !== DefaultTemplateGroupId) {
        this.groupNames.push(group.translations
          ? group.translations[this.locale]
          : group.id);
      }
    }
    this.loading = false;
  }
}
