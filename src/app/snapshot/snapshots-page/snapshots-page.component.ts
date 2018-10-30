import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { ListService } from '../../shared/components/list/list.service';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { Grouping, Snapshot, Volume } from '../../shared/models';
import { NgrxEntities } from '../../shared/interfaces';
import { VirtualMachine } from '../../vm';
import { SnapshotCardItemComponent } from './snapshot-list-item/snapshot-card-item.component';
import { SnapshotListItemComponent } from './snapshot-list-item/snapshot-list-item.component';

@Component({
  selector: 'cs-snapshots-page',
  templateUrl: './snapshots-page.component.html',
  providers: [ListService],
})
export class SnapshotsPageComponent implements OnChanges {
  @Input()
  public snapshots: Snapshot[];
  @Input()
  public volumes: NgrxEntities<Volume>;
  @Input()
  public virtualMachines: NgrxEntities<VirtualMachine>;
  @Input()
  public groupings: Grouping[] = [];
  @Input()
  public isLoading: boolean;
  @Input()
  public query: string;

  public mode: ViewMode;
  public viewModeKey = 'volumePageViewMode';

  @Output()
  public viewModeChange = new EventEmitter();

  public inputs;
  public outputs;

  constructor(public listService: ListService) {
    this.inputs = {
      isSelected: (item: Snapshot) => this.listService.isSelected(item.id),
    };

    this.outputs = {
      onClick: this.selectSnapshot.bind(this),
    };
  }

  public ngOnChanges(changes) {
    if (changes.volumes) {
      this.inputs.volumes = this.volumes;
    }
    if (changes.virtualMachines) {
      this.inputs.virtualMachines = this.virtualMachines;
    }
    if (changes.query) {
      this.inputs.query = this.query;
    }
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX ? SnapshotCardItemComponent : SnapshotListItemComponent;
  }

  public changeMode(mode) {
    this.mode = mode;
  }

  public selectSnapshot(snapshot: Snapshot): void {
    this.listService.showDetails(snapshot.id);
  }
}
