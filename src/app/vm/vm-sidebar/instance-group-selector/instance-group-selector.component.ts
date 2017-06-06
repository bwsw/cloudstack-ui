import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { InstanceGroupService } from '../../../shared/services';
import { InstanceGroup } from '../../../shared/models';
import { VmService } from '../../shared/vm.service';
import { MdlDialogReference, MdlTextFieldComponent } from '@angular-mdl/core';


enum InstanceGroupAssignmentMode {
  assignExistingGroup,
  createNewGroup,
  removeFromGroup
}

@Component({
  selector: 'cs-instance-group-selector',
  templateUrl: 'instance-group-selector.component.html',
  styleUrls: ['instance-group-selector.component.scss']
})
export class InstanceGroupSelectorComponent implements OnInit {
  @ViewChild('groupField') public groupTextbox: MdlTextFieldComponent;

  public maxLength = 255;
  public modes = InstanceGroupAssignmentMode;
  public newGroupName: string;
  private anyGroups: boolean;
  private groupNames: Array<string>;
  private loading: boolean;
  private _mode: InstanceGroupAssignmentMode;


  constructor(
    @Inject('vm') public vm: VirtualMachine,
    private dialog: MdlDialogReference,
    private instanceGroupService: InstanceGroupService,
    private vmService: VmService
  ) {}

  public ngOnInit(): void {
    this.updateGroups();
  }

  public get mode(): InstanceGroupAssignmentMode {
    return this._mode;
  }

  public get groupName(): string {
    return this.vm.instanceGroup && this.vm.instanceGroup.name;
  }

  public set mode(mode: InstanceGroupAssignmentMode) {
    if (this.mode !== mode) {
      this._mode = mode;
      this.activateInput();
    } else {
      this._mode = mode;
    }
  }

  public get groupChanged(): boolean {
    const groupWasEmpty = !this.groupName && !!this.newGroupName;
    const groupChanged = this.groupName !== this.newGroupName;
    return groupWasEmpty || groupChanged;
  }

  public get isModeNew(): boolean {
    return this.mode === this.modes.createNewGroup || !this.anyGroups;
  }

  public get isModeExisting(): boolean {
    return this.mode === this.modes.assignExistingGroup;
  }

  public get isModeRemove(): boolean {
    return this.mode === this.modes.removeFromGroup;
  }

  public changeGroup(): void {
    this.loading = true;
    if (this.mode === InstanceGroupAssignmentMode.removeFromGroup) {
      this.newGroupName = '';
    }

    const instanceGroup = new InstanceGroup(this.newGroupName);
    this.instanceGroupService.add(this.vm, instanceGroup)
      .subscribe(vm => {
        this.dialog.hide();
        this.instanceGroupService.groupsUpdates.next();
        this.vmService.updateVmInfo(vm);
      });
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  private checkIfAnyGroups(): void {
    this.anyGroups = this.groupNames && this.groupNames.length > 0;
    if (!this.anyGroups) {
      this.mode = InstanceGroupAssignmentMode.createNewGroup;
    } else {
      this.mode = InstanceGroupAssignmentMode.assignExistingGroup;
    }
  }

  private updateGroups(): void {
    this.vmService.getInstanceGroupList()
      .subscribe(groups => {
        this.groupNames = groups
          .map(group => group.name)
          .filter(groupName => groupName !== this.groupName);

        this.checkIfAnyGroups();
        this.setDefaultGroup();
      });
  }

  private activateInput(): void {
    if (this.mode === InstanceGroupAssignmentMode.createNewGroup) {
      this.newGroupName = undefined;
      setTimeout(() => this.groupTextbox.setFocus());
    } else {
      this.setDefaultGroup();
    }
  }

  private setDefaultGroup(): void {
    if (this.anyGroups) {
      this.newGroupName = this.groupNames[0];
    }
  }
}
