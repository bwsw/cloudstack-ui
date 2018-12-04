import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { VmSnapshotViewModel } from '../../models/vm-snapshot.view-model';

@Component({
  selector: 'cs-vm-snapshot-list-view',
  templateUrl: './vm-snapshot-list-view.component.html',
  styleUrls: ['./vm-snapshot-list-view.component.scss'],
})
export class VmSnapshotListViewComponent {
  @Input()
  public item: VmSnapshotViewModel;
  @Input()
  public isSelected: (vmSnapshot: VmSnapshotViewModel) => boolean;
  @Output()
  public clicked = new EventEmitter<VmSnapshotViewModel>();
  @ViewChild(MatMenuTrigger)
  public matMenuTrigger: MatMenuTrigger;

  public onSelect() {
    this.clicked.emit(this.item);
  }
}
