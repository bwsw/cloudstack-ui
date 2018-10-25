import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Snapshot, Volume } from '../../../shared/models';
import { NgrxEntities } from '../../../shared/interfaces';
import { VirtualMachine } from '../../../vm';
import { SnapshotItemComponent } from './snapshot-item.component';

@Component({
  selector: 'cs-snapshot-card-item',
  templateUrl: 'snapshot-card-item.component.html',
  styleUrls: ['snapshot-card-item.component.scss'],
})
export class SnapshotCardItemComponent extends SnapshotItemComponent {
  @Input()
  public item: Snapshot;
  @Input()
  public volumes: NgrxEntities<Volume>;
  @Input()
  public virtualMachines: NgrxEntities<VirtualMachine>;
  @Input()
  public isSelected: (snapshot: Snapshot) => boolean;
  @Input()
  public query: string;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onClick = new EventEmitter<Snapshot>();
  @ViewChild(MatMenuTrigger)
  public matMenuTrigger: MatMenuTrigger;

  constructor(translateService: TranslateService) {
    super(translateService);
  }
}
