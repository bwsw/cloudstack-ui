import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdlDialogReference } from '../../../dialog/dialog-module';
import { Mode } from '../../../shared/components/create-update-delete-dialog/create-update-delete-dialog.component';
import { InstanceGroup } from '../../../shared/models';
import { InstanceGroupService } from '../../../shared/services/instance-group.service';
import { VirtualMachine } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';


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
    @Inject('virtualMachine') public vm: VirtualMachine,
    public dialog: MdlDialogReference,
    private instanceGroupService: InstanceGroupService,
    private vmService: VmService
  ) {}

  public ngOnInit(): void {
    this.loadGroups();
  }

  public get groupName(): string {
    return this.vm.instanceGroup && this.vm.instanceGroup.name;
  }

  public changeGroup(name: string): void {
    this.loading = true;
    const instanceGroup = new InstanceGroup(name);
    this.instanceGroupService.add(this.vm, instanceGroup)
      .finally(() => this.dialog.hide())
      .subscribe(vm => {
        this.instanceGroupService.groupsUpdates.next();
        this.vmService.updateVmInfo(vm);
      });
  }

  public removeGroup(): void {
    this.changeGroup('');
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  private loadGroups(): void {
    this.loading = true;
    this.groupNames$ = this.vmService.getInstanceGroupList()
      .finally(() => this.loading = false)
      .map(groups => {
        return groups.map(group => group.name);
      });
  }
}
