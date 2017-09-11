import { Component, Input } from '@angular/core';
import { TemplateInstanceGroup } from '../../../shared/services/tags/template/base/template-instance-group';
import { MdDialog, MdDialogConfig } from '@angular/material';
// tslint:disable-next-line
import { TemplateInstanceGroupTranslationEditorComponent } from '../template-instance-group-translation-editor/template-instance-group-translation-editor.component';


@Component({
  selector: 'cs-template-instance-group-editor',
  templateUrl: 'template-instance-group-editor.component.html'
})
export class TemplateInstanceGroupEditorComponent {
  @Input() public groups: Array<TemplateInstanceGroup>;

  public instanceGroupName: string;

  constructor(public dialog: MdDialog) {}

  public get instanceGroupExists(): boolean {
    return !!this.groups.find(group => group.name === this.instanceGroupName);
  }

  public get showAddButton(): boolean {
    return this.instanceGroupName && !this.instanceGroupExists;
  }

  public get showEditButton(): boolean {
    return this.instanceGroupName && this.instanceGroupExists;
  }

  public onOpenTranslationEditor(): void {
    this.dialog.open(TemplateInstanceGroupTranslationEditorComponent, <MdDialogConfig>{

    });
  }
}
