import { Component, Input } from '@angular/core';
import { Volume } from '../../../../shared/models/volume.model';


@Component({
  selector: 'cs-spare-drive-sidebar-disk-offering',
  templateUrl: 'spare-drive-sidebar-disk-offering.component.html'
})
export class SpareDriveSidebarDiskOfferingComponent {
  @Input() public volume: Volume;
}
