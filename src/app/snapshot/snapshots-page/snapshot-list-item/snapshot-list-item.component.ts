import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgrxEntities } from '../../../shared/interfaces';

import { Snapshot, Volume } from '../../../shared/models';
import { VirtualMachine } from '../../../vm';
import { SnapshotItemComponent } from './snapshot-item.component';

@Component({
  selector: 'cs-snapshot-list-item',
  templateUrl: 'snapshot-list-item.component.html',
  styleUrls: ['snapshot-list-item.component.scss'],
})
export class SnapshotListItemComponent extends SnapshotItemComponent {
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
  @Output()
  public clicked = new EventEmitter<Snapshot>();

  constructor(translateService: TranslateService) {
    super(translateService);
  }
}
