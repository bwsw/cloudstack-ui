import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VirtualMachine } from '../../../shared/vm.model';
import { Volume } from '../../../../shared/models';
import { VolumeService } from '../../../../shared/services/volume.service';
import { DialogService } from '../../../../shared/services';
import { SpareDriveAttachmentDialogComponent } from './spare-drive-attachment-dialog.component';


@Component({
  selector: 'cs-spare-drive-attachment-detail'
})
export class SpareDriveAttachmentDetailComponent {
  @Input() public virtualMachine: VirtualMachine;
  @Output() public volumeSelected: EventEmitter<Volume>;

  public loading: boolean;
  private volumes: Array<Volume>;

  constructor(
    private dialogService: DialogService,
    private volumeService: VolumeService
  ) {}

  public ngOnInit(): void {
    this.loading = true;
    this.volumeSelected = new EventEmitter<Volume>();
    this.volumeService
      .getList({ zoneId: this.virtualMachine.zoneId })
      .subscribe(volumes => {
        this.volumes = volumes;
        this.loading = false;
      });
  }

  public showDialog(): void {
    this.dialogService.showCustomDialog({
      component: SpareDriveAttachmentDialogComponent,
      providers: [{ provide: 'volumes', useValue: this.volumes }]
    })
      .switchMap(res => res.onHide())
      .subscribe(data => this.attachVolume(data));
  }

  private attachVolume(data: any): void {
    console.log(data);
  }
}
