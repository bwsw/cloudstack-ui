import {
  Component,
  Input
} from '@angular/core';
import { Offering } from '../../../../shared/models/offering.model';
import { Volume } from '../../../../shared/models/volume.model';


@Component({
  selector: 'cs-volume-sidebar-disk-offering',
  templateUrl: 'volume-sidebar-disk-offering.component.html',
  styleUrls: ['volume-sidebar-disk-offering.component.scss'],
})
export class VolumeSidebarDiskOfferingComponent {
  @Input() public volume: Volume;
  @Input() public offering: Offering;
  @Input() public columns: Array<string>;
  public tableId = 'VOLUME_PAGE.DETAILS';

  public getName(column: string): string {
    const defaultName = this.tableId.toUpperCase() + '.' + column.toUpperCase();
    return column === 'name'
      ?
      defaultName + '_SIDEBAR'
      :
      defaultName;
  }
}
