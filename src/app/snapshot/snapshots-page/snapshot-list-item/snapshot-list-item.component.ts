import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Snapshot } from '../../../shared/models';
import { SnapshotItemComponent } from './snapshot-item.component';

@Component({
  selector: 'cs-snapshot-list-item',
  templateUrl: 'snapshot-list-item.component.html',
  styleUrls: ['snapshot-list-item.component.scss']
})
export class SnapshotListItemComponent extends SnapshotItemComponent {
  @Input() public item: Snapshot;
  @Input() public isSelected: (snapshot: Snapshot) => boolean;
  @Output() public onClick = new EventEmitter<Snapshot>();
  @ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;

  constructor(private translateService: TranslateService) {
    super(translateService);
  }
}
