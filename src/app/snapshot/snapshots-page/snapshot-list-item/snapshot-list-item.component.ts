import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Dictionary } from '@ngrx/entity/src/models';
import { TranslateService } from '@ngx-translate/core';
import { Snapshot, Volume } from '../../../shared/models';
import { VirtualMachine } from '../../../vm';
import { SnapshotItemComponent } from './snapshot-item.component';

@Component({
  selector: 'cs-snapshot-list-item',
  templateUrl: 'snapshot-list-item.component.html',
  styleUrls: ['snapshot-list-item.component.scss']
})
export class SnapshotListItemComponent extends SnapshotItemComponent {
  @Input() public item: Snapshot;
  @Input() public volumes: Dictionary<Volume>;
  @Input() public virtualMachines: Dictionary<VirtualMachine>;
  @Input() public isSelected: (snapshot: Snapshot) => boolean;
  @Output() public onClick = new EventEmitter<Snapshot>();
  @ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;

  constructor(private translateService: TranslateService) {
    super(translateService);
  }
}
