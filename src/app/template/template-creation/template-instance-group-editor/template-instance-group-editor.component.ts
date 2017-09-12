import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
// tslint:disable-next-line
import { TemplateInstanceGroupTranslationEditorComponent } from '../template-instance-group-translation-editor/template-instance-group-translation-editor.component';
import { InstanceGroup } from '../../../shared/models/instance-group.model';


@Component({
  selector: 'cs-template-instance-group-editor',
  templateUrl: 'template-instance-group-editor.component.html',
  styleUrls: ['template-instance-group-editor.component.scss']
})
export class TemplateInstanceGroupEditorComponent implements OnChanges {
  @Input() public groups: Array<InstanceGroup>;
  @Output() public onGroupChange = new EventEmitter<InstanceGroup>();

  public instanceGroup: InstanceGroup;
  public instanceGroupName = '';
  public instanceGroupNames: Array<string>;
  public visibleInstanceGroupNames: Array<string>;

  constructor(public dialog: MdDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if ('groups' in changes) {
      this.instanceGroupNames = this.groups.map(group => group.name);
      this.filterInstanceGroupNames();
    }
  }

  public get instanceGroupExists(): boolean {
    return !!this.instanceGroupNames.find(groupName => groupName === this.instanceGroupName);
  }

  public get showAddButton(): boolean {
    return this.instanceGroupName && !this.instanceGroupExists;
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
          this.onTranslationsChange();
        }
      });
  }

  public onNameChange(): void {
    this.filterInstanceGroupNames();

    if (this.instanceGroupExists) {
      this.instanceGroup = this.groups.find(group => {
        return group.name === this.instanceGroupName;
      });
    } else {
      this.instanceGroup = new InstanceGroup(this.instanceGroupName);
    }

    this.onGroupChange.emit(this.instanceGroup);
  }

  public onTranslationsChange(): void {
    this.onGroupChange.emit(this.instanceGroup);
  }

  private filterInstanceGroupNames(): void {
    this.visibleInstanceGroupNames = this.instanceGroupNames.filter(name => {
      return name.includes(this.instanceGroupName);
    })
  }
}
