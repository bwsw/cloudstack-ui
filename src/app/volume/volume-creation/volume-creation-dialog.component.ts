import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { Zone } from '../../shared/models';
import { VolumeCreationData } from '../../shared/models/volume.model';
import { AuthService } from '../../shared/services/auth.service';
import { VirtualMachine } from '../../vm';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isSharedOffering } from '../../shared/models/offering.model';


@Component({
  selector: 'cs-volume-creation-dialog',
  templateUrl: 'volume-creation-dialog.component.html',
  styleUrls: ['volume-creation-dialog.component.scss']
})
export class VolumeCreationDialogComponent {
  @Input() public isLoading: boolean;
  @Input() public diskOfferings: DiskOffering[];
  @Input() public zones: Zone[];
  @Input() public maxSize: number;
  @Input() public vmList: VirtualMachine[];
  @Output() public onVolumeCreate = new EventEmitter<VolumeCreationData>();
  @Output() public onZoneUpdated = new EventEmitter<Zone>();
  @Output() public onVmUpdated = new EventEmitter<VirtualMachine>();

  public volumeForm: FormGroup;

  public diskOffering: DiskOffering;
  public showResizeSlider: boolean;
  public size = 1;
  public minSize = 1;

  constructor(
    public dialogRef: MatDialogRef<VolumeCreationDialogComponent>,
    public authService: AuthService
  ) {
    this.minSize = this.authService.getCustomDiskOfferingMinSize();
    this.createForm();
  }

  public onSubmit(e): void {
    e.preventDefault();

    const volume = {
      name: this.volumeForm.value.name,
      zoneid: this.volumeForm.value.zone,
      diskofferingid: this.volumeForm.value.diskOffering.id,
      size: !this.diskOffering.iscustomized ? undefined : this.volumeForm.value.size ,
      virtualmachineid: this.volumeForm.value.vm || undefined,
    };

    Object.keys(volume).forEach(key => volume[key] === undefined ? delete volume[key] : volume[key]);

    this.onVolumeCreate.emit(volume);
  }

  public updateDiskOffering(diskOffering: DiskOffering): void {
    this.diskOffering = diskOffering;
    this.showResizeSlider = this.diskOffering.iscustomized;
  }

  public updateZone(zoneId: string) {
    this.onZoneUpdated.emit(this.zones.find(zone => zone.id === zoneId));
  }

  private createForm() {
    this.volumeForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      zone: new FormControl('', Validators.required),
      diskOffering: new FormControl('',  Validators.required),
      size: new FormControl(this.minSize, []),
      vm: new FormControl('', [])
    });

    this.volumeForm.controls['diskOffering'].valueChanges.subscribe((diskOffering: DiskOffering) => {
      if (isSharedOffering(diskOffering)) {
        this.volumeForm.controls['vm'].setValidators([]);
      } else {
        this.volumeForm.controls['vm'].setValidators([Validators.required]);
      }
      this.volumeForm.controls['vm'].updateValueAndValidity();
    });
  }
}
