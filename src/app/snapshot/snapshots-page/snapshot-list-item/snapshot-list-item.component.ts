import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Snapshot, Volume } from '../../../shared/models';
import { NgrxEntities } from '../../../shared/interfaces';
import { VirtualMachine } from '../../../vm';
import { SnapshotItemComponent } from './snapshot-item.component';


@Component({
  selector: 'cs-snapshot-list-item',
  templateUrl: 'snapshot-list-item.component.html',
  styleUrls: ['snapshot-list-item.component.scss']
})
export class SnapshotListItemComponent extends SnapshotItemComponent {
  @Input() public item: Snapshot;
  @Input() public volumes: NgrxEntities<Volume>;
  @Input() public virtualMachines: NgrxEntities<VirtualMachine>;
  @Input() public isSelected: (snapshot: Snapshot) => boolean;
  @Input() public query: string;
  @Output() public onClick = new EventEmitter<Snapshot>();
  @ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;

  constructor(private translateService: TranslateService) {
    super(translateService);
  }
}
