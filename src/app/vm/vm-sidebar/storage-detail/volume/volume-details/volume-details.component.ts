import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DiskOffering, Volume } from '../../../../../shared/models';
import { VolumeService } from '../../../../../shared/services/volume.service';
import { VolumeOfferingService } from '../../../../../shared/services/volume-offering.service';


@Component({
  selector: 'cs-volume-details',
  templateUrl: 'volume-details.component.html',
  styleUrls: ['volume-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VolumeDetailsComponent implements OnInit {
  @Input() public volume: Volume;

  public description: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private volumeService: VolumeService,
    private volumeOfferingService: VolumeOfferingService
  ) {}

  public ngOnInit(): void {
    this.getDiskOffering();
    this.getDescription();
  }

  public hasPerformanceInfo(): boolean {
    if (!this.volume || !this.volume.diskOffering) {
      return false;
    }

    const diskOffering = this.volume.diskOffering;
    return [
      diskOffering.minIops,
      diskOffering.maxIops,
      diskOffering.diskBytesReadRate,
      diskOffering.diskBytesWriteRate,
      diskOffering.diskIopsReadRate,
      diskOffering.diskIopsWriteRate
    ].some(a => a !== undefined);
  }

  // todo: issue #48
  private getDiskOffering(): void {
    this.volumeOfferingService.getVolumeOffering(this.volume)
      .subscribe(diskOffering => {
        this.volume.diskOffering = diskOffering as DiskOffering;
        this.changeDetector.detectChanges();
      });
  }

  // todo: issue #48
  private getDescription(): void {
    this.volumeService.getDescription(this.volume)
      .subscribe(description => {
        this.description = description;
        this.changeDetector.detectChanges();
      });
  }
}
