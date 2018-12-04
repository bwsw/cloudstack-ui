import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgrxEntities } from '../../../shared/interfaces';
import { OsType, Volume } from '../../../shared/models';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';

import { VirtualMachine } from '../../shared/vm.model';
import { VmListItemComponent } from '../vm-list-item.component';

@Component({
  selector: 'cs-vm-card-list-item',
  templateUrl: 'vm-list-card-item.component.html',
  styleUrls: ['vm-list-card-item.component.scss'],
})
export class VmListCardItemComponent extends VmListItemComponent {
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

  constructor(vmTagService: VmTagService) {
    super(vmTagService);
  }
}
