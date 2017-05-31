import { Component, Input, OnInit } from '@angular/core';
import { InstanceGroup } from '../../../shared/models';
import { InstanceGroupService } from '../../../shared/services';
import { VirtualMachine } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';


@Component({
  selector: 'cs-instance-group',
  templateUrl: 'instance-group.component.html'
})
export class InstanceGroupComponent implements OnInit {
  @Input() public vm: VirtualMachine;

  public groupName: string;
  public groupNames: Array<string>;

  constructor(
    private instanceGroupService: InstanceGroupService,
    private vmService: VmService
  ) {}

  public ngOnInit(): void {
    if (this.vm.instanceGroup) {
      this.groupName = this.vm.instanceGroup.name;
    } else {
      this.groupName = undefined;
    }
  }

  public get doShowChangeGroupButton(): boolean {
    let groupWasEmpty = !this.vm.instanceGroup && !!this.groupName;
    let groupChanged = this.vm.instanceGroup && this.vm.instanceGroup.name !== this.groupName;
    return groupWasEmpty || groupChanged;
  }

  public changeGroup(): void {
    let instanceGroup = new InstanceGroup(this.groupName);
    this.instanceGroupService.add(this.vm, instanceGroup)
      .subscribe(vm => {
        this.instanceGroupService.groupsUpdates.next();
        this.vmService.updateVmInfo(vm);
        this.updateGroups();
      });
  }

  private updateGroups(): void {
    this.vmService.getInstanceGroupList().subscribe(groups => {
      this.groupNames = groups.map(group => group.name);
    });
  }
}
