import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../../../../shared/models';
import { VolumeService } from '../../../../../shared/services/volume.service';
import { VirtualMachine } from '../../../../shared/vm.model';
import { SpareDriveAttachmentDialogComponent } from '../spare-drive-attchment-dialog/spare-drive-attachment-dialog.component';


@Component({
  selector: 'cs-spare-drive-attachment-detail',
  templateUrl: 'spare-drive-attachment-detail.component.html',
  styleUrls: ['spare-drive-attachment-detail.component.scss']
})
export class SpareDriveAttachmentDetailComponent implements OnInit {
  @Input() public virtualMachine: VirtualMachine;
  @Output() public onAttach = new EventEmitter();

  public loading: boolean;
  public selectedVolume: Volume;
  public volumes: Array<Volume>;

  constructor(
    private dialog: MdDialog,
    private volumeService: VolumeService
  ) {}

  public ngOnInit(): void {
    if (!this.virtualMachine) {
      throw new Error('the virtualMachine property is missing in cs-spare-drive-attachment-detail');
    }
    this.loadVolumes().subscribe();
    this.volumeService.onVolumeAttachment
      .subscribe(() => this.loadVolumes().subscribe());
  }

  public showDialog(): void {
    this.loadVolumes()
      .switchMap(() => {
        return this.dialog.open(SpareDriveAttachmentDialogComponent, {
          width: '375px',
          data: this.volumes
        }).afterClosed();
      })
      .subscribe((volume: Volume) => this.selectedVolume = volume);
  }

  public attachVolume(): void {
    this.loading = true;
    this.volumeService.attach({
      id: this.selectedVolume.id,
      virtualMachineId: this.virtualMachine.id
    })
      .finally(() => setTimeout(() => this.loading = false))
      .subscribe(() => {
        this.onAttach.next(this.selectedVolume);
        this.selectedVolume = undefined;
      });
  }

  private loadVolumes(): Observable<void> {
    return this.volumeService
      .getSpareList({ zoneId: this.virtualMachine.zoneId })
      .map(volumes => {
        this.volumes = volumes;
      });
  }
}
