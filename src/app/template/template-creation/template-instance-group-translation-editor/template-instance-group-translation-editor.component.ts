import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { InstanceGroup } from '../../../shared/models/instance-group.model';


@Component({
  selector: 'cs-template-instance-group-translation-editor',
  templateUrl: 'template-instance-group-translation-editor.component.html',
  styleUrls: ['template-instance-group-translation-editor.component.scss']
})
export class TemplateInstanceGroupTranslationEditorComponent implements OnInit {
  public newGroup: InstanceGroup;

  constructor(
    public dialogRef: MdDialogRef<TemplateInstanceGroupTranslationEditorComponent>,
    @Inject(MD_DIALOG_DATA) public group: InstanceGroup
  ) {}

  public ngOnInit(): void {
    this.newGroup = new InstanceGroup(
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
