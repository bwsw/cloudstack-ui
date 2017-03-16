import { Component, Input, HostBinding } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html'
})
export class SpareDriveSidebarComponent {
  @Input() public volume: Volume;
  @HostBinding('class.grid') public grid = true;
}
