import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel } from '../../../shared/base-template.model';
import { TemplateGroupService } from '../../../../shared/services/template-group.service';
import { Mode } from '../../../../shared/components/create-update-delete-dialog/create-update-delete-dialog.component';
import { TemplateGroup } from '../../../../shared/models/template-group.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'cs-template-group-selector',
  templateUrl: 'template-group-selector.component.html',
  styleUrls: ['template-group-selector.component.scss']
})
export class TemplateGroupSelectorComponent implements OnInit {
  public groups: Array<TemplateGroup>;
  public groupNames: Array<string>;
  public groupNames$: Observable<Array<string>>;
  public loading: boolean;
  public modes = Mode;
  public lang;

  constructor(
    @Inject(MAT_DIALOG_DATA) public template: BaseTemplateModel,
    public dialogRef: MatDialogRef<TemplateGroupSelectorComponent>,
    private templateGroupService: TemplateGroupService,
    private translateService: TranslateService
  ) {
    this.lang = this.translateService.currentLang;
  }

  public ngOnInit(): void {
    this.loadGroups();
  }

  public get groupName(): string {
    return this.template.templateGroup && this.template.templateGroup.id;
  }

  public changeGroup(translation): void {
    this.loading = true;
    const templateGroup = this.groups.find(
      group => group.translations[this.lang] === translation);
    this.templateGroupService.add(this.template, templateGroup)
      .finally(() => this.dialogRef.close())
      .subscribe();
  }

  public removeGroup(): void {
    this.changeGroup('');
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private loadGroups(): void {
    this.loading = true;
    this.groups = this.templateGroupService.getList();
    this.groupNames = this.groups
      .map((group) => group.translations[this.lang]);
    this.loading = false;
  }
}
