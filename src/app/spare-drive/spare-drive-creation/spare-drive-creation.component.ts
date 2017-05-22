import { Component, OnInit } from '@angular/core';
import { Zone } from '../../shared';
import { ZoneService } from '../../shared/services/zone.service';
import { DiskOffering } from '../../shared';
import { DiskOfferingService } from '../../shared';
import { ResourceUsageService, ResourceStats } from '../../shared/services/resource-usage.service';
import { MdlDialogReference } from 'angular2-mdl';
import { Observable } from 'rxjs/Observable';
import { VolumeCreationData } from '../spare-drive-page/spare-drive-page.component';
import { Volume } from '../../shared/models';
import { VolumeService } from '../../shared/services/volume.service';
import { JobsNotificationService } from '../../shared/services';
import { DialogService } from '../../shared/services/dialog/dialog.service';


@Component({
  selector: 'cs-spare-drive-creation',
  templateUrl: 'spare-drive-creation.component.html',
  styleUrls: ['spare-drive-creation.component.scss']
})
export class SpareDriveCreationComponent implements OnInit {
  public name: string;
  public zones: Array<Zone>;
  public diskOfferingId: string;
  public diskOfferings: Array<DiskOffering> = [];
  public showResizeSlider: boolean;
  public size = 1;
  public minSize = 1;
  public maxSize = 2;

  public loading: boolean;
  private _zoneId: string;

  private notificationId: string;

  constructor(
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private jobsNotificationService: JobsNotificationService,
    private resourceUsageService: ResourceUsageService,
    private volumeService: VolumeService,
    private zoneService: ZoneService
  ) {}

  public ngOnInit(): void {
    this.loading = true;

    this.getZones()
      .switchMap(() => this.getDiskOfferings())
      .delay(100) // because ngIf elements appear when the form is already visible
                  // todo: replace delay with *loading directive with minimum loading time
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
    this.loading = true;
    this.notificationId = this.jobsNotificationService.add('VOLUME_CREATE_IN_PROGRESS');
    this.createVolume(this.creationParams)
      .finally(() => this.loading = false)
      .subscribe(
        volume => this.onVolumeCreated(volume),
        error => this.handleError(error)
      );
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public updateDiskOffering(offering: DiskOffering): void {
    this.diskOfferingId = offering.id;
    this.showResizeSlider = offering.isCustomized;
  }

  private createVolume(volumeCreationData: VolumeCreationData): Observable<Volume> {
    return this.volumeService.create(volumeCreationData)
      .switchMap(volume => this.getVolumeWithDiskOffering(volume));
  }

  // todo: change to something like volumeService.get(id, { diskOfferings: true });
  private getVolumeWithDiskOffering(volume: Volume): Observable<Volume> {
    if (volume && volume.diskOfferingId) {
      return this.diskOfferingService
        .get(volume.diskOfferingId)
        .map((diskOffering: DiskOffering) => {
          volume.diskOffering = diskOffering;
          return volume;
        });
    } else {
      return Observable.of(volume);
    }
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
          this.handleInsufficientResources();
          return;
        }

        this.diskOfferingService.getList({ zone: this.zone, maxSize: resourceUsage.available.primaryStorage })
          .subscribe(offerings => {
            this.diskOfferings = offerings;

            if (!this.diskOfferings.length) {
              this.handleInsufficientResources();
              return;
            }

            this.updateDiskOffering(this.diskOfferings[0]);
            this.updateSizeLimits(resourceUsage);
          });
      });
  }

  private handleInsufficientResources(): void {
    this.dialogService.alert('VOLUME_LIMIT_EXCEEDED')
      .subscribe(_ => this.dialog.hide());
  }

  private get creationParams(): any {
    return Object.assign({},
      {
        name: this.name,
        zoneId: this.zoneId,
        diskOfferingId: this.diskOfferingId
      },
      this.showResizeSlider ? { size: this.size } : {}
    );
  }

  private onVolumeCreated(volume: Volume): void {
    this.jobsNotificationService.finish({
      id: this.notificationId,
      message: 'VOLUME_CREATE_DONE'
    });
    this.dialog.hide(volume);
  }

  private handleError(error: any): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    });
    this.jobsNotificationService.fail({
      id: this.notificationId,
      message: 'VOLUME_CREATE_FAILED',
    });
  }
}
