import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AffinityGroupSelectorContainerComponent } from '../../affinity-group-selector/affinity-group-selector-container.component';
import { DateTimeFormatterService } from '../../../../shared/services/date-time-formatter.service';
import { VirtualMachine, VmState } from '../../../shared/vm.model';
import { AffinityGroup, affinityGroupTypesMap } from '../../../../shared/models';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-affinity-group',
  templateUrl: 'affinity-group.component.html',
  styleUrls: ['affinity-group.component.scss'],
})
export class AffinityGroupComponent {
  @Input()
  public vm: VirtualMachine;
  @Input()
  public affinityGroups: AffinityGroup[];
  @Output()
  public affinityGroupChanged = new EventEmitter<string[]>();
  @Output()
  public affinityGroupRemoved = new EventEmitter<string>();

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {}

  public changeAffinityGroup(): void {
    this.showAffinityGroupDialog();
  }

  public get canActivate() {
    return this.vm.state !== VmState.InProgress;
  }

  public showRemoveDialog(id: string): void {
    this.dialogService
      .confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_AFFINITY_DELETION' })
      .subscribe(response => {
        if (response) {
          this.removeAffinityGroup(id);
        }
      });
  }

  public getAffinityGroupType(id: string): string {
    const affinityGroup = this.affinityGroups.find(group => group.id === id);
    return affinityGroup && affinityGroupTypesMap[affinityGroup.type];
  }

  private removeAffinityGroup(id: string) {
    this.affinityGroupRemoved.emit(id);
  }

  private showAffinityGroupDialog(): void {
    this.dialog
      .open(AffinityGroupSelectorContainerComponent, {
        width: '650px',
        data: {
          enablePreselected: false,
          preselectedAffinityGroups: this.vm.affinitygroup,
        },
        disableClose: true,
      } as MatDialogConfig)
      .afterClosed()
      .subscribe((groupIds?: string[]) => {
        if (groupIds) {
          this.affinityGroupChanged.emit(groupIds);
        }
      });
  }
}
