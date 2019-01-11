import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnapshotPageViewMode } from '../../types';

@Component({
  selector: 'cs-snapshots-filter-toggle',
  template: `
    <mat-button-toggle-group [value]="viewMode" (change)="onViewModeChange($event.value)">
      <mat-button-toggle [value]="snapshotPageViewMode.Volume">
        {{ 'SNAPSHOT_PAGE.FILTERS.VOLUME' | translate }}
      </mat-button-toggle>
      <mat-button-toggle [value]="snapshotPageViewMode.VM">
        {{ 'SNAPSHOT_PAGE.FILTERS.VM' | translate }}
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class SnapshotFilterToggleComponent {
  @Input()
  public viewMode: SnapshotPageViewMode;
  @Output()
  public viewModeChange = new EventEmitter<SnapshotPageViewMode>();

  public snapshotPageViewMode = SnapshotPageViewMode;

  public onViewModeChange(mode: SnapshotPageViewMode) {
    this.viewModeChange.emit(mode);
  }
}
