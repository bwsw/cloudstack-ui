import { Component, Input, OnInit } from '@angular/core';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
import { Volume } from '../../../../../shared/models/volume.model';
import { VolumeService } from '../../../../../shared/services/volume.service';
import { SnapshotActionsService } from '../../../../../snapshot/snapshot-actions.service';


@Component({
  selector: 'cs-snapshot-actions',
  templateUrl: 'snapshot-actions.component.html'
})
export class SnapshotActionsComponent implements OnInit {
  @Input() public snapshot: Snapshot;
  public volume: Volume;

  constructor(
    public snapshotActionsService: SnapshotActionsService,
    public volumeService: VolumeService
  ) {}

  public ngOnInit(): void {
    this.volumeService.get(this.snapshot.volumeId).subscribe(volume => this.volume = volume);
  }
}
