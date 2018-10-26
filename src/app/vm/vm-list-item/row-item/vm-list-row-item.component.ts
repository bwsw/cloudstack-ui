import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import { VirtualMachine } from '../../shared/vm.model';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { VmListItemComponent } from '../vm-list-item.component';
import { OsType, Volume } from '../../../shared/models';
import { NgrxEntities } from '../../../shared/interfaces';

@Component({
  selector: 'cs-vm-row-list-item',
  templateUrl: 'vm-list-row-item.component.html',
  styleUrls: ['vm-list-row-item.component.scss'],
})
export class VmListRowItemComponent extends VmListItemComponent {
  @Input()
  public item: VirtualMachine;
  @Input()
  public volumes: Volume[];
  @Input()
  public osTypesMap: NgrxEntities<OsType>;
  @Input()
  public query: string;
  @Input()
  public isSelected: (vm: VirtualMachine) => boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger)
  public matMenuTrigger: MatMenuTrigger;

  constructor(vmTagService: VmTagService) {
    super(vmTagService);
  }
}
