import { Component, Input, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TemplateInstanceGroup } from '../../../shared/services/tags/template/base/template-instance-group';


@Component({
  selector: 'cs-template-instance-group-translation-editor',
  templateUrl: 'template-instance-group-translation-editor.component.html'
})
export class TemplateInstanceGroupTranslationEditorComponent implements OnInit {
  @Input() public group: TemplateInstanceGroup;

  public newGroup: TemplateInstanceGroup;

  constructor(public dialogRef: MdDialogRef<TemplateInstanceGroupTranslationEditorComponent>) {}

  public ngOnInit(): void {
    this.newGroup = this.group;
  }

  public onSave(): void {
    this.dialogRef.close(this.newGroup);
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
