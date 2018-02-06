import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { getType, SecurityGroup } from '../sg.model';
import { MatMenuTrigger } from '@angular/material';
import { VirtualMachine } from '../../vm';
import { Dictionary } from '@ngrx/entity/src/models';
import { SecurityGroupViewMode } from '../sg-view-mode';

export class SecurityGroupListItemComponent implements OnChanges {
  public item: SecurityGroup;
  public searchQuery: () => string;
  public onClick = new EventEmitter();
  public matMenuTrigger: MatMenuTrigger;
  public isSelected: (securityGroup) => boolean;
  public vmList: Dictionary<VirtualMachine>;

  public query: string;

  public get sgVmName() {
    return this.vmList[this.item.virtualmachineids[0]].name;
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
