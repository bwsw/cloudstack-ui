import { Component, OnInit } from '@angular/core';
import { VolumeService } from '../../shared/services/volume.service';
import { Volume } from '../../shared/models/volume.model';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { DiskOffering } from '../../shared/models/disk-offering.model';


@Component({
  selector: 'cs-spare-drive-page',
  templateUrl: 'spare-drive-page.component.html',
  styleUrls: ['spare-drive-page.component.scss']
})
export class SpareDrivePageComponent implements OnInit {
  public isDetailOpen: boolean;
  public volumes: Array<Volume>;
  public _selectedVolume: Volume;

  constructor(
    private diskOfferingService: DiskOfferingService,
    private volumeService: VolumeService
  ) {}

  public ngOnInit(): void {
    let diskOfferings: Array<DiskOffering>;
    this.diskOfferingService.getList()
      .map(offerings => diskOfferings = offerings)
      .switchMap(offerings => {
        diskOfferings = offerings;
        return this.volumeService.getList();
      })
      .subscribe(volumes => {
        this.volumes = volumes
          .filter(volume => !volume.virtualMachineId && volume.type === 'DATADISK')
          .map(volume => {
            volume.diskOffering = diskOfferings.find(offering => offering.id === volume.diskOfferingId);
            return volume;
          });
      });
  }

  public selectVolume(volume: Volume): void {
    this.selectedVolume = volume;
  }

  public get selectedVolume(): Volume {
    return this._selectedVolume;
  }

  public set selectedVolume(volume: Volume) {
    this._selectedVolume = volume;
    this.isDetailOpen = true;
  }

  public hideDetail(): void {
    this.isDetailOpen = !this.isDetailOpen;
    this._selectedVolume = null;
  }
}
