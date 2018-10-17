import { Component, Input, OnInit } from '@angular/core';
import { Volume, VolumeType } from '../../../../../shared';

@Component({
  selector: 'cs-volume',
  templateUrl: 'volume.component.html',
  styleUrls: ['volume.component.scss'],
})
export class VolumeComponent implements OnInit {
  @Input()
  public volume: Volume;

  public expandDetails: boolean;
  // tslint:disable-next-line:variable-name
  private _loading = false;

  public ngOnInit(): void {
    this.expandDetails = false;
  }

  public get loading(): boolean {
    return this._loading || this.volume['loading'];
  }

  public get showAttachmentActions(): boolean {
    return this.volume.type === VolumeType.DATADISK;
  }

  public toggleDetails(): void {
    this.expandDetails = !this.expandDetails;
  }
}
