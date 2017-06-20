import { Component, Inject } from '@angular/core';

import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from './snapshot-actions.service';
import { MdlDialogReference } from '../../../../../dialog/dialog-module';

@Component({
  selector: 'cs-snapshot-modal',
  templateUrl: 'snapshot-modal.component.html',
  styles: [`
    .snapshot-name {
      max-width: 290px;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .with-description td {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    tbody:hover {
      background-color: #eee;
    }

    .description-row {
      height: 32px;
      padding-top: 0;
    }

    .description-row td {
      height: 32px;
      border-top: none;
      padding-top: 0;
    }
  `]
})
export class SnapshotModalComponent {
  constructor(
    public snapshotActionsService: SnapshotActionsService,
    public dialog: MdlDialogReference,
    @Inject('volume') public volume: Volume
  ) { }
}
