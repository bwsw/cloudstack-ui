import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LocalizedInstanceGroup } from '../../../shared/services/tags/template/base/template-instance-group';
import { MdDialog, MdDialogConfig } from '@angular/material';
// tslint:disable-next-line
import { TemplateInstanceGroupTranslationEditorComponent } from '../template-instance-group-translation-editor/template-instance-group-translation-editor.component';


@Component({
  selector: 'cs-template-instance-group-editor',
  templateUrl: 'template-instance-group-editor.component.html',
  styleUrls: ['template-instance-group-editor.component.scss']
})
export class TemplateInstanceGroupEditorComponent implements OnChanges {
  @Input() public groups: Array<LocalizedInstanceGroup>;
  @Output() public onGroupChange = new EventEmitter<LocalizedInstanceGroup>();

  public instanceGroup = new LocalizedInstanceGroup('');
  public instanceGroupNames: Array<string> = [];

  constructor(public dialog: MdDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if ('groups' in changes) {
      this.instanceGroupNames = this.groups.map(group => group.name);
    }
  }

  public get instanceGroupExists(): boolean {
    return !!this.instanceGroupNames.find(groupName => groupName === this.instanceGroup.name);
  }

  public get showAddButton(): boolean {
    return this.instanceGroup.name && !this.instanceGroupExists;
  }

  public onOpenTranslationEditor(): void {
    this.dialog.open(TemplateInstanceGroupTranslationEditorComponent, <MdDialogConfig>{
      data: this.instanceGroup,
      width: '400px'
    })
      .afterClosed()
      .subscribe(instanceGroup => {
        if (instanceGroup) {
          this.instanceGroup = instanceGroup;
          this.onChange();
        }
      });
  }

  public onChange(): void {
    this.onGroupChange.emit(this.instanceGroup);
  }
}
