import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import { getType, isSecurityGroupNative, SecurityGroup } from '../sg.model';
import { VirtualMachine } from '../../vm';
import { SecurityGroupViewMode } from '../sg-view-mode';
import { NgrxEntities } from '../../shared/interfaces';

export class SecurityGroupListItemComponent implements OnChanges {
  public item: SecurityGroup;
  public searchQuery: () => string;
  public onClick = new EventEmitter();
  public matMenuTrigger: MatMenuTrigger;
  public isSelected: (securityGroup) => boolean;
  public vmList: NgrxEntities<VirtualMachine>;

  public query: string;

  public get sgVmName() {
    if (!isSecurityGroupNative(this.item)) {
      return '';
    }

    const vmId = this.item.virtualmachineids[0];
    const vm = this.vmList[vmId];

    return vm ? vm.name : '';
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const query = changes.searchQuery;
    if (query) {
      this.query = this.searchQuery();
    }
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.matMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public get isPrivate(): boolean {
    return getType(this.item) === SecurityGroupViewMode.Private.toString();
  }
}
