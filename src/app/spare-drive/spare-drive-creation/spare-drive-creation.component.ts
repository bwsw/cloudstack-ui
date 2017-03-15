import { Component, OnInit } from '@angular/core';
import { Zone } from '../../shared/models/zone.model';
import { ZoneService } from '../../shared/services/zone.service';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { MdlDialogReference } from 'angular2-mdl';


@Component({
  selector: 'cs-spare-drive-creation',
  templateUrl: 'spare-drive-creation.component.html'
})
export class SpareDriveCreationComponent implements OnInit {
  public name: string;
  public zoneId: string;
  public zones: Array<Zone>;
  public diskOfferingId: string;
  public diskOfferings: Array<DiskOffering>;
  public showResizeSlider: boolean;
  public size = 1;

  public minSize = 1;
  public maxSize: number;

  constructor(
    private dialog: MdlDialogReference,
    private diskOfferingService: DiskOfferingService,
    private resourceUsageService: ResourceUsageService,
    private zoneService: ZoneService
  ) {}

  public ngOnInit(): void {
    this.getDiskOfferings();
    this.getZones();
    this.getSizeLimits();
  }

  public onCreate(): void {
    let params = {
      name: this.name,
      zoneId: this.zoneId,
      diskOfferingId: this.diskOfferingId
    };

    if (this.showResizeSlider) {
      params['size'] = this.size;
    }

    this.dialog.hide(params);
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public updateDiskOffering(offering: DiskOffering): void {
    this.diskOfferingId = offering.id;
    this.showResizeSlider = offering.isCustomized;
  }

  private getZones(): void {
    this.zoneService.getList()
      .subscribe(zones => {
        this.zones = zones;
        if (this.zones.length) {
          this.zoneId = this.zones[0].id;
        }
      });
  }

  private getDiskOfferings(): void {
    this.diskOfferingService.getList()
      .subscribe(offerings => {
        this.diskOfferings = offerings;
        if (this.diskOfferings.length) {
          this.diskOfferingId = this.diskOfferings[0].id;
        }
      });
  }

  private getSizeLimits(): void {
    this.resourceUsageService.getResourceUsage()
      .subscribe(resourceUsage => {
        this.minSize = 1;
        this.size = this.minSize;
        this.maxSize = resourceUsage.available.primaryStorage;
      });
  }
}
