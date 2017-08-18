import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';
import { DiskOffering, DiskOfferingService, Zone } from '../../shared';
import { Volume } from '../../shared/models';
import { JobsNotificationService } from '../../shared/services';
import { ResourceStats, ResourceUsageService } from '../../shared/services/resource-usage.service';
import { VolumeService } from '../../shared/services/volume.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VolumeCreationData } from '../spare-drive-page/spare-drive-page.component';


@Component({
  selector: 'cs-spare-drive-creation',
  templateUrl: 'spare-drive-creation.component.html',
  styleUrls: ['spare-drive-creation.component.scss']
})
export class SpareDriveCreationComponent implements OnInit {
  public name: string;
  public zones: Array<Zone>;
  public diskOffering: DiskOffering;
  public diskOfferings: Array<DiskOffering> = [];
  public showResizeSlider: boolean;
  public size = 1;
  public minSize = 1;
  public maxSize = 2;

  public loading: boolean;
  private _zoneId: string;

  private notificationId: string;
  private insufficientResourcesDialog: Observable<any>;

  constructor(
    private dialogRef: MdDialogRef<SpareDriveCreationComponent>,
    private dialogsService: DialogsService,
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
      .finally(() => this.loading = false)
      .subscribe();
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
    this.dialogRef.close();
  }

  public updateDiskOffering(offering: DiskOffering): void {
    this.diskOffering = offering;
    this.showResizeSlider = offering.isCustomized;
  }

  private createVolume(volumeCreationData: VolumeCreationData): Observable<Volume> {
    return this.volumeService.create(volumeCreationData)
      .switchMap(volume => this.getVolumeWithDiskOffering(volume));
  }

  // todo: change to something like volumeService.getWithDetails(id, { diskOfferings: true });
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
    this.dialogRef.close();
    if (!this.insufficientResourcesDialog) {
      this.insufficientResourcesDialog = this.dialogsService.alert({ message: 'VOLUME_LIMIT_EXCEEDED' });
      this.insufficientResourcesDialog
        .subscribe(() => this.insufficientResourcesDialog = undefined);
    }
  }

  private get creationParams(): any {
    return Object.assign({},
      {
        name: this.name,
        zoneId: this.zoneId,
        diskOfferingId: this.diskOffering.id
      },
      this.showResizeSlider ? { size: this.size } : {}
    );
  }

  private onVolumeCreated(volume: Volume): void {
    this.jobsNotificationService.finish({
      id: this.notificationId,
      message: 'VOLUME_CREATE_DONE'
    });
    this.dialogRef.close(volume);
  }

  private handleError(error: any): void {
    this.dialogsService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
    this.jobsNotificationService.fail({
      id: this.notificationId,
      message: 'VOLUME_CREATE_FAILED',
    });
  }
}
