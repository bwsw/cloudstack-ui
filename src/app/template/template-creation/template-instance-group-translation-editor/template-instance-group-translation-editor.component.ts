import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { LocalizedInstanceGroup } from '../../../shared/services/tags/template/base/template-instance-group';


@Component({
  selector: 'cs-template-instance-group-translation-editor',
  templateUrl: 'template-instance-group-translation-editor.component.html',
  styleUrls: ['template-instance-group-translation-editor.component.scss']
})
export class TemplateInstanceGroupTranslationEditorComponent implements OnInit {
  public newGroup: LocalizedInstanceGroup;

  constructor(
    public dialogRef: MdDialogRef<TemplateInstanceGroupTranslationEditorComponent>,
    @Inject(MD_DIALOG_DATA) public group: LocalizedInstanceGroup
  ) {}

  public ngOnInit(): void {
    this.newGroup = new LocalizedInstanceGroup(
      this.group.name,
      this.group.translations
    );
  }

  public onSave(): void {
    this.dialogRef.close(this.newGroup);
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
