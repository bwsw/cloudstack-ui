import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AffinityGroup } from '../../../../shared/models';
import { AffinityGroupSelectorContainerComponent } from '../../../vm-sidebar/affinity-group-selector/affinity-group-selector-container.component';

@Component({
  selector: 'cs-vm-creation-affinity-group-manager',
  templateUrl: 'vm-creation-affinity-group-manager.component.html',
  styleUrls: ['vm-creation-affinity-group-manager.component.scss'],
})
export class VmCreationAffinityGroupManagerComponent {
  @Output()
  public affinityGroupChanged = new EventEmitter<string>();
  @Input()
  public affinityGroup: AffinityGroup;

  constructor(private dialog: MatDialog) {}

  public showDialog(): void {
    const preselectedAffinityGroups = this.affinityGroup ? [this.affinityGroup] : [];
    this.dialog
      .open(AffinityGroupSelectorContainerComponent, {
        width: '650px',
        data: {
          preselectedAffinityGroups,
          enablePreselected: true,
        },
        disableClose: true,
      } as MatDialogConfig)
      .afterClosed()
      .subscribe((res?: string) => {
        if (res) {
          this.affinityGroupChanged.emit(res[0]);
        }
      });
  }
}
