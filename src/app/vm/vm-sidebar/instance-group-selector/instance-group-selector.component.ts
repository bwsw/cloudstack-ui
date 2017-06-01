import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { InstanceGroupService } from '../../../shared/services';
import { InstanceGroup } from '../../../shared/models';
import { VmService } from '../../shared/vm.service';
import { MdlDialogReference, MdlTextFieldComponent } from '@angular-mdl/core';
import { DialogService } from '../../../shared/services/dialog/dialog.service';


enum InstanceGroupAssignmentMode {
  createNewGroup,
  assignExistingGroup
}

@Component({
  selector: 'cs-instance-group-selector',
  templateUrl: 'instance-group-selector.component.html',
  styleUrls: ['instance-group-selector.component.scss']
})
export class InstanceGroupSelectorComponent implements OnInit {
  public anyGroups: boolean;
  public groupNames: Array<string>;
  public loading: boolean;
  public _mode: InstanceGroupAssignmentMode;
  public maxLength = 255;
  public modes = InstanceGroupAssignmentMode;
  public newGroupName: string;

  @ViewChild('groupField') public groupTextbox: MdlTextFieldComponent;

  constructor(
    @Inject('vm') public vm: VirtualMachine,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
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

  public changeGroup(): void {
    this.loading = true;
    let instanceGroup = new InstanceGroup(this.newGroupName);
    this.instanceGroupService.add(this.vm, instanceGroup)
      .subscribe(
        vm => {
          this.dialog.hide();
          this.instanceGroupService.groupsUpdates.next();
          this.vmService.updateVmInfo(vm);
        },
        error => {
          this.loading = false;
          this.dialogService.alert({
            translationToken: error.message,
            interpolateParams: error.params
          });
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
