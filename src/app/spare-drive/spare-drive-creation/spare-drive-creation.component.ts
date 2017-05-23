import { Component, OnInit } from '@angular/core';
import { Zone } from '../../shared';
import { ZoneService } from '../../shared/services/zone.service';
import { DiskOffering } from '../../shared';
import { DiskOfferingService } from '../../shared';
import { ResourceUsageService, ResourceStats } from '../../shared/services/resource-usage.service';
import { Observable } from 'rxjs/Observable';
import { MdlDialogReference } from '../../dialog/dialog-module';


@Component({
  selector: 'cs-spare-drive-creation',
  templateUrl: 'spare-drive-creation.component.html',
  styleUrls: ['spare-drive-creation.component.scss']
})
export class SpareDriveCreationComponent implements OnInit {
  public name: string;
  public zones: Array<Zone>;
  public diskOfferingId: string;
  public diskOfferings: Array<DiskOffering>;
  public showResizeSlider: boolean;
  public size = 1;
  public minSize = 1;
  public maxSize: number;

  public loading: boolean;
  public enoughResources: boolean;
  private _zoneId: string;

  constructor(
    private dialog: MdlDialogReference,
    private diskOfferingService: DiskOfferingService,
    private resourceUsageService: ResourceUsageService,
    private zoneService: ZoneService) {}

  public ngOnInit(): void {
    this.loading = true;

    this.getZones()
      .switchMap(() => this.getDiskOfferings())
      .subscribe(() => this.loading = false);
  }

  public get zoneId(): string {
    return this._zoneId;
  }

  public set zoneId(id: string) {
    this._zoneId = id;
    this.getDiskOfferings().subscribe();
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

  private get zone(): Zone {
    return this.zones.find(zone => zone.id === this.zoneId);
  }

  private getZones(): Observable<any> {
    return this.zoneService.getList()
      .map(zones => {
        this.zones = zones;
        if (this.zones.length) {
          this.zoneId = this.zones[0].id;
        }
      });
  }

  private updateSizeLimits(resourceUsage: ResourceStats): void {
    this.minSize = 1;
    this.size = this.minSize;
    this.maxSize = resourceUsage.available.primaryStorage;
  }

  private getDiskOfferings(): Observable<any> {
    return this.resourceUsageService.getResourceUsage()
      .map(resourceUsage => {
        if (resourceUsage.available.volumes <= 0 || resourceUsage.available.primaryStorage < 1) {
          this.enoughResources = false;
          return;
        }

        this.diskOfferingService.getList({ zone: this.zone, maxSize: resourceUsage.available.primaryStorage })
          .subscribe(offerings => {
            this.diskOfferings = offerings;

            if (!this.diskOfferings.length) {
              this.enoughResources = false;
              return;
            }

            this.updateDiskOffering(this.diskOfferings[0]);
            this.updateSizeLimits(resourceUsage);
            this.enoughResources = true;
          });
      });
  }
}
