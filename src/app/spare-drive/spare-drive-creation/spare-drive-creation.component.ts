import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Zone } from '../../shared/models/zone.model';
import { ZoneService } from '../../shared/services/zone.service';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { ResourceUsageService, ResourceStats } from '../../shared/services/resource-usage.service';
import { MdlDialogReference } from 'angular2-mdl';
import { Observable } from 'rxjs/Observable';
import { VolumeCreationData } from '../../shared/services/volume.service';


export class SpareDriveFormData {
  constructor(
    public zoneId = '',
    public offeringIsCustomized = false,
    public diskOffering: DiskOffering = null,
    public name = '',
    public size = 1
  ) {}

  public getParams(): VolumeCreationData {
    let params = {
      name: this.name,
      zoneId: this.zoneId,
      diskOfferingId: this.diskOffering.id
    };

    if (this.offeringIsCustomized) {
      params['size'] = this.size;
    }

    return params;
  }
}

@Component({
  selector: 'cs-spare-drive-creation',
  templateUrl: 'spare-drive-creation.component.html',
  styleUrls: ['spare-drive-creation.component.scss']
})
export class SpareDriveCreationComponent implements OnInit {
  public spareDriveFormData: SpareDriveFormData;

  public zones: Array<Zone>;
  public diskOfferings: Array<DiskOffering>;
  public minSize = 1;
  public maxSize: number;

  public loading: boolean;
  public enoughResources: boolean;

  constructor(
    @Optional() @Inject('formData') public formData,
    private dialog: MdlDialogReference,
    private diskOfferingService: DiskOfferingService,
    private resourceUsageService: ResourceUsageService,
    private zoneService: ZoneService
  ) {}

  public ngOnInit(): void {
    this.loading = true;
    this.spareDriveFormData = this.formData || new SpareDriveFormData();
    this.getZones().subscribe(() => this.loading = false);
  }

  public get showResizeSlider(): boolean {
    return this.spareDriveFormData.offeringIsCustomized;
  }

  public get zoneId(): string {
    return this.spareDriveFormData.zoneId;
  }

  public set zoneId(id: string) {
    this.spareDriveFormData.zoneId = id;
    this.getDiskOfferings().subscribe();
  }

  public onCreate(): void {
    this.dialog.hide(this.spareDriveFormData);
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public updateDiskOffering(offering: DiskOffering): void {
    this.spareDriveFormData.diskOffering = offering;
  }

  private get zone(): Zone {
    return this.zones.find(zone => zone.id === this.zoneId);
  }

  private getZones(): Observable<any> {
    return this.zoneService.getList()
      .map(zones => {
        this.zones = zones;
        if (this.zones.length && (!this.formData || !this.formData.zoneId)) {
          this.zoneId = this.zones[0].id;
        }
      });
  }

  private updateSizeLimits(resourceUsage: ResourceStats): void {
    this.minSize = 1;
    this.spareDriveFormData.size = this.minSize;
    this.maxSize = resourceUsage.available.primaryStorage;
  }

  private setDefaultDiskOffering(): void {
    if (!this.diskOfferings.find(offering => this.spareDriveFormData.diskOffering.id === offering.id)) {
      this.updateDiskOffering(this.diskOfferings[0]);
    }
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

            this.setDefaultDiskOffering();
            this.enoughResources = true;
            this.updateSizeLimits(resourceUsage);
          });
      });
  }
}
