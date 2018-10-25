import { Component, Input } from '@angular/core';
import { DiskOffering, Volume } from '../../../../shared/models';
import * as moment from 'moment';
import { Utils } from '../../../../shared/services/utils/utils.service';

@Component({
  selector: 'cs-volume-sidebar-disk-offering',
  templateUrl: 'volume-sidebar-disk-offering.component.html',
  styleUrls: ['volume-sidebar-disk-offering.component.scss'],
})
export class VolumeSidebarDiskOfferingComponent {
  @Input()
  public volume: Volume;
  @Input()
  public offering: DiskOffering;

  public get offeringCreated(): Date {
    return moment(this.offering.created).toDate();
  }

  public convertToMb(bytes: number): number {
    const megabytes = Utils.convertBytesToMegabytes(bytes);
    return Math.round(megabytes);
  }
}
