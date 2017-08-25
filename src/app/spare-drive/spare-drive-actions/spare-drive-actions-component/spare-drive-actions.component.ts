import { Component, Input } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { SpareDriveActionsService } from '../../spare-drive-actions.service';
import { SpareDriveAction } from '../spare-drive-action';


@Component({
  selector: 'cs-spare-drive-actions',
  templateUrl: 'spare-drive-actions.component.html'
})
export class SpareDriveActionsComponent {
  @Input() public volume: Volume;

  constructor(public spareDriveActionsService: SpareDriveActionsService) {}

  public onAction(action: SpareDriveAction, volume: Volume): void {
    action.activate(volume).subscribe();
  }
}
