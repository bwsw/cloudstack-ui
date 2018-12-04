import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { ListService } from '../../../shared/components/list/list.service';
import { ViewMode } from '../../../shared/components/view-mode-switch/view-mode-switch.component';
import { NgrxEntities } from '../../../shared/interfaces';
import { Grouping, Snapshot, Volume } from '../../../shared/models';
import { VirtualMachine } from '../../../vm';
import { VmSnapshotCardViewComponent } from '../../components/vm-snapshot-card-view/vm-snapshot-card-view.component';
import { VmSnapshotListViewComponent } from '../../components/vm-snapshot-list-view/vm-snapshot-list-view.component';
import { VmSnapshotViewModel } from '../../models/vm-snapshot.view-model';
import { SnapshotCardItemComponent } from '../../snapshots-page/snapshot-list-item/snapshot-card-item.component';
import { SnapshotListItemComponent } from '../../snapshots-page/snapshot-list-item/snapshot-list-item.component';
import { SnapshotPageViewMode } from '../../types';

@Component({
  selector: 'cs-snapshots-page',
  templateUrl: './snapshots-page.component.html',
  providers: [ListService],
})
export class SnapshotsPageComponent implements OnChanges {
  @Input()
  public snapshots: Snapshot[];
  @Input()
  public vmSnapshots: VmSnapshotViewModel[];
  @Input()
  public viewMode: SnapshotPageViewMode;
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
  public snapshotPageViewMode = SnapshotPageViewMode;

  @Output()
  public viewModeChange = new EventEmitter();

  public inputs;
  public outputs;

  constructor(public listService: ListService) {
    this.inputs = {
      isSelected: (item: Snapshot) => this.listService.isSelected(item.id),
    };

    this.outputs = {
      clicked: this.selectSnapshot.bind(this),
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

  public get vmSnapshotComponent() {
    return this.mode === ViewMode.BOX ? VmSnapshotCardViewComponent : VmSnapshotListViewComponent;
  }

  public changeMode(mode) {
    this.mode = mode;
  }

  public selectSnapshot(snapshot: Snapshot): void {
    this.listService.showDetails(snapshot.id);
  }
}
