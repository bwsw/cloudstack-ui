import { EventEmitter, Component, Output, Input, OnInit } from '@angular/core';
import { VirtualMachine } from '../../../../shared/vm.model';
import { Volume } from '../../../../../shared/models';
import { VolumeService } from '../../../../../shared/services/volume.service';
import {
  SpareDriveAttachmentDialogComponent
} from '../spare-drive-attchment-dialog/spare-drive-attachment-dialog.component';
import { SpareDriveActionsService } from '../../../../../spare-drive/spare-drive-actions.service';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../../dialog/dialog-module/dialog.service';


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
    private dialogService: DialogService,
    private spareDriveActionsService: SpareDriveActionsService,
    private volumeService: VolumeService
  ) {}

  public ngOnInit(): void {
    if (!this.virtualMachine) {
      throw new Error('the virtualMachine property is missing in cs-spare-drive-attachment-detail');
    }
    this.loadVolumes().subscribe();
    this.spareDriveActionsService
      .onVolumeAttachment
      .subscribe(() => {
        this.loadVolumes().subscribe();
      });
  }

  public showDialog(): void {
    this.loadVolumes()
      .switchMap(() => {
        return this.dialogService.showCustomDialog({
          component: SpareDriveAttachmentDialogComponent,
          providers: [{ provide: 'volumes', useValue: this.volumes }],
          classes: 'spare-drive-attachment-dialog'
        });
      })
      .switchMap(res => res.onHide())
      .onErrorResumeNext()
      .subscribe((volume: Volume) => {
        this.selectedVolume = volume;
      });
  }

  public attachIso(): void {
    this.loading = true;
    this.spareDriveActionsService.attach({
      id: this.selectedVolume.id,
      virtualMachineId: this.virtualMachine.id
    })
      .subscribe(() => {
        this.loading = false;
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
