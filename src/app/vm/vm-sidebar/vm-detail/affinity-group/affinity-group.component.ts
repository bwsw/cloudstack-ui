import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {
  AffinityGroupSelectorContainerComponent
} from '../../affinity-group-selector/affinity-group-selector-container.component';
import { DateTimeFormatterService } from '../../../../shared/services/date-time-formatter.service';
import { VirtualMachine, VmState } from '../../../shared/vm.model';
import { AffinityGroup, AffinityGroupTypesMap } from '../../../../shared/models';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';


@Component({
  selector: 'cs-affinity-group',
  templateUrl: 'affinity-group.component.html',
  styleUrls: ['affinity-group.component.scss']
})
export class AffinityGroupComponent {
  @Input() public vm: VirtualMachine;
  @Input() public affinityGroups: AffinityGroup[];
  @Output() public onAffinityGroupChange = new EventEmitter<string[]>();
  @Output() public onAffinityGroupRemove = new EventEmitter<string>();

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {
  }

  public changeAffinityGroup(): void {
    this.showAffinityGroupDialog();
  }

  private showAffinityGroupDialog(): void {
    this.dialog.open(AffinityGroupSelectorContainerComponent, <MatDialogConfig>{
      width: '720px',
      data: {
        isVmCreation: false,
        preselectedAffinityGroups: this.vm.affinitygroup
      },
      disableClose: true
    }).afterClosed()
      .subscribe((groupIds?: string[]) => {
        if (groupIds) {
          this.onAffinityGroupChange.emit(groupIds);
        }
      });
  }

  public get canActivate() {
    return this.vm.state !== VmState.InProgress;
  }

  public showRemoveDialog(id: string): void {
    this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_AFFINITY_DELETION' })
      .subscribe(response => {
        if (response) {
          this.removeAffinityGroup(id);
        }
      });
  }

  public getAffinityGroupType(id: string): string {
    const affinityGroup = this.affinityGroups.find(group => group.id === id);
    return affinityGroup && AffinityGroupTypesMap[affinityGroup.type];
  }

  private removeAffinityGroup(id: string) {
    this.onAffinityGroupRemove.emit(id);
  }
}
