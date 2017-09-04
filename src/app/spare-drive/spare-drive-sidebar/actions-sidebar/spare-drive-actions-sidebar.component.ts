import { Component, Input } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';


@Component({
  selector: 'cs-spare-drive-actions-sidebar',
  templateUrl: 'spare-drive-actions-sidebar.component.html',
  styleUrls: ['spare-drive-actions-sidebar.component.scss']
})
export class SpareDriveActionsSidebarComponent {
  @Input() public volume: Volume;
}
