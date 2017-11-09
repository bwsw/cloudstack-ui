import {
  Component,
  Input
} from '@angular/core';
import { Offering } from '../../../../shared/models/offering.model';
import { Volume } from '../../../../shared/models/volume.model';


@Component({
  selector: 'cs-volume-sidebar-disk-offering',
  templateUrl: 'volume-sidebar-disk-offering.component.html'
})
export class VolumeSidebarDiskOfferingComponent {
  @Input() public volume: Volume;
  @Input() public offering: Offering;

  public get name(): string {
    return this.offering && (this.offering.name || '').toString();
  }

  public get displayText(): string {
    return this.offering && (this.offering.displayText || '').toString();
  }

  public get minIops(): string {
    return this.offering && (this.offering.minIops || '').toString();
  }

  public get maxIops(): string {
    return this.offering && (this.offering.maxIops || '').toString();
  }

  public get diskBytesReadRate(): number {
    return this.offering && this.offering.diskBytesReadRate || 0;
  }

  public get diskBytesWriteRate(): number {
    return this.offering && this.offering.diskBytesWriteRate || 0;
  }

  public get diskIopsReadRate(): string {
    return this.offering && (this.offering.diskIopsReadRate || '').toString();
  }

  public get diskIopsWriteRate(): string {
    return this.offering && (this.offering.diskBytesWriteRate || '').toString();
  }
}
