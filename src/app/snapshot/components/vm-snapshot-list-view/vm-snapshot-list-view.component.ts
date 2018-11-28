import { Component, Input, OnInit } from '@angular/core';
import { VmSnapshotViewModel } from '../../models/vm-snapshot.view-model';

@Component({
  selector: 'cs-vm-snapshot-list-view',
  templateUrl: './vm-snapshot-list-view.component.html',
  styleUrls: ['./vm-snapshot-list-view.component.scss'],
})
export class VmSnapshotListViewComponent implements OnInit {
  @Input()
  public item: VmSnapshotViewModel;

  constructor() {}

  ngOnInit() {}
}
