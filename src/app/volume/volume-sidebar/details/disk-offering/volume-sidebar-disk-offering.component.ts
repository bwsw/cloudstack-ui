import {
  Component,
  Input
} from '@angular/core';
import { Volume } from '../../../../shared/models/volume.model';
import * as moment from 'moment';
import { DiskOffering } from '../../../../shared/models';


@Component({
  selector: 'cs-volume-sidebar-disk-offering',
  templateUrl: 'volume-sidebar-disk-offering.component.html',
  styleUrls: ['volume-sidebar-disk-offering.component.scss'],
})
export class VolumeSidebarDiskOfferingComponent {
  @Input() public volume: Volume;
  @Input() public offering: DiskOffering;
  @Input() public columns: Array<string>;
  public tableId = 'VOLUME_PAGE.DETAILS';
  public customFields = ['provisioningtype', 'storagetype', 'iscustomized'];
  public notCustomFields = ['provisioningtype', 'storagetype', 'iscustomized', 'created'];

  public get offeringCreated(): Date {
    return moment(this.offering.created).toDate();
  }

  public isCustomField(column: string, columns: Array<string>): boolean {
    return 0 <= columns.indexOf(column);
  }
}
