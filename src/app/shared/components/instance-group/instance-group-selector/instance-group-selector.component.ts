import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';
import { InstanceGroup } from '../../../models';
import { Mode } from '../../create-update-delete-dialog/create-update-delete-dialog.component';
import { InstanceGroupEnabledService } from '../../../interfaces/instance-group-enabled-service';


export interface InstanceGroupSelectorData {
  entity: InstanceGroupEnabled;
  entityService: InstanceGroupEnabledService;
}

@Component({
  selector: 'cs-instance-group-selector',
  templateUrl: 'instance-group-selector.component.html',
  styleUrls: ['instance-group-selector.component.scss']
})
export class InstanceGroupSelectorComponent implements OnInit {
  public groupNames$: Observable<Array<string>>;
  public loading: boolean;
  public modes = Mode;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: InstanceGroupSelectorData,
    public dialogRef: MdDialogRef<InstanceGroupSelectorComponent>,
  ) {}

  public ngOnInit(): void {
    this.loadGroups();
  }

  public get entity(): InstanceGroupEnabled {
    return this.data.entity;
  }

  public get entityService(): InstanceGroupEnabledService {
    return this.data.entityService;
  }

  public get groupName(): string {
    return this.entity.instanceGroup && this.entity.instanceGroup.name;
  }

  public changeGroup(name: string): void {
    this.loading = true;
    const instanceGroup = new InstanceGroup(name);
    this.entityService.addInstanceGroup(this.entity, instanceGroup)
      .finally(() => this.dialogRef.close())
      .subscribe(entity => {
        this.entityService.instanceGroupUpdateObservable.next(entity);
      });
  }

  public removeGroup(): void {
    this.changeGroup('');
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private loadGroups(): void {
    this.loading = true;
    this.groupNames$ = this.data.entityService.getInstanceGroupList()
      .finally(() => this.loading = false)
      .map(groups => {
        return groups.map(group => group.name);
      });
  }
}
