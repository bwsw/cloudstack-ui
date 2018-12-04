import { Component, Input } from '@angular/core';
import { VmSnapshotSidebarViewModel } from '../../models/vm-snapshot-sidebar.view-model';

@Component({
  selector: 'cs-vm-snapshot-sidebar',
  templateUrl: './vm-snapshot-sidebar.component.html',
  styleUrls: ['./vm-snapshot-sidebar.component.scss'],
})
export class VmSnapshotSidebarComponent {
  @Input()
  public vmSnapshot: VmSnapshotSidebarViewModel;
}
