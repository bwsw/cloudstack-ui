import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ListService } from '../../shared/components/list/list.service';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { VmListRowItemComponent } from '../vm-list-item/row-item/vm-list-row-item.component';
import { VmListCardItemComponent } from '../vm-list-item/card-item/vm-list-card-item.component';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { OsType, Volume } from '../../shared/models';
import { NgrxEntities } from '../../shared/interfaces';

@Component({
  selector: 'cs-vm-list',
  templateUrl: 'vm-list.component.html',
})
export class VmListComponent implements OnChanges {
  @Input()
  public vms: VirtualMachine[];
  @Input()
  public volumes: Volume[];
  @Input()
  public osTypesMap: NgrxEntities<OsType>;
  @Input()
  public groupings: any[];
  @Input()
  public mode: ViewMode;
  @Input()
  public query: string;
  public inputs;
  public outputs;

  constructor(public listService: ListService) {
    this.inputs = {
      query: this.query,
      isSelected: item => this.listService.isSelected(item.id),
      volumes: this.volumes,
      osTypesMap: this.osTypesMap,
    };

    this.outputs = {
      onClick: this.selectVirtualMachine.bind(this),
    };
  }

  public ngOnChanges(changes: SimpleChanges): void {
    for (const propName of Object.keys(changes)) {
      if (propName === 'volumes') {
        this.inputs.volumes = this.volumes;
      }
      if (propName === 'osTypesMap') {
        this.inputs.osTypesMap = this.osTypesMap;
      }
      if (propName === 'query') {
        this.inputs.query = this.query;
      }
    }
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX ? VmListCardItemComponent : VmListRowItemComponent;
  }

  public selectVirtualMachine(vm: VirtualMachine): void {
    if (vm.state !== VmState.Error && vm.state !== VmState.Deploying) {
      this.listService.showDetails(vm.id);
    }
  }
}
