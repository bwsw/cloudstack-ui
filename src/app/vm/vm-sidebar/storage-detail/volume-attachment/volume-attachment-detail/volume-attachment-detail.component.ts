import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Volume } from '../../../../../shared/models';
import { VolumeAttachmentDialogComponent } from '../volume-attchment-dialog/volume-attachment-dialog.component';


@Component({
  selector: 'cs-volume-attachment-detail',
  templateUrl: 'volume-attachment-detail.component.html',
  styleUrls: ['volume-attachment-detail.component.scss']
})
export class VolumeAttachmentDetailComponent implements OnInit {
  @Input() public volumes: Array<Volume>;
  @Output() public onAttach = new EventEmitter();

  public loading: boolean;
  public selectedVolume: Volume;

  constructor(
     private dialog: MatDialog
  ) {}

  public ngOnInit(): void {


  }

  public showDialog(): void {
    this.dialog.open(VolumeAttachmentDialogComponent, {
          width: '375px',
          data: this.volumes
        }).afterClosed()
      .subscribe((volume: Volume) => this.selectedVolume = volume);
  }

  public attachVolume(): void {
    this.onAttach.emit(this.selectedVolume);
  }


}
