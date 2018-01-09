import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnapshotPageMode } from '../../../../shared/models';


@Component({
  selector: 'cs-snapshot-filter',
  templateUrl: 'snapshot-filter.component.html'
})
export class SnapshotFilterComponent {
 @Input() public viewMode: SnapshotPageMode;
 @Output() public viewModeChange = new EventEmitter<SnapshotPageMode>();

 public get SnapshotPageMode() {
   return SnapshotPageMode;
 }
}
