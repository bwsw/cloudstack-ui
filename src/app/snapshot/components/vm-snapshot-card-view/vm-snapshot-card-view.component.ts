import { Component, Input, OnInit } from '@angular/core';
import { VmSnapshotViewModel } from '../../models/vm-snapshot.view-model';

@Component({
  selector: 'cs-vm-snapshot-card-view',
  templateUrl: './vm-snapshot-card-view.component.html',
  styleUrls: ['./vm-snapshot-card-view.component.scss'],
})
export class VmSnapshotCardViewComponent implements OnInit {
  @Input()
  public item: VmSnapshotViewModel;

  constructor() {}

  ngOnInit() {}
}
