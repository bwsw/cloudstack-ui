import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { AffinityGroupService } from '../../shared/services/affinity-group.service';
import { VirtualMachine } from '../shared/vm.model';

@Component({
  selector: 'cs-affinity-group-dialog',
  templateUrl: 'affinity-group-dialog.component.html'
})
export class AffinityGroupDialogComponent implements OnInit {
  public affinityGroups: Array<AffinityGroup>;
  public selectedAffinityGroup: string;

  public changingGroupInProgress = false;

  constructor(
    private affinityGroupService: AffinityGroupService,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    @Inject('virtualMachine') public vm: VirtualMachine
  ) { }

  public ngOnInit(): void {
    this.affinityGroupService.getList().subscribe(groups => {
      this.affinityGroups = groups;
      if (this.affinityGroups.length) {
        this.selectedAffinityGroup = this.affinityGroups[0].id;
      }
    });
  }

  public hide(): void {
    this.dialog.hide();
  }

  public changeAffinityGroup(): void {
    this.changingGroupInProgress = true;
    this.affinityGroupService
      .updateForVm(this.vm, this.selectedAffinityGroup)
      .finally(() => this.changingGroupInProgress = false)
      .subscribe(
        vm => this.dialog.hide(vm.affinityGroup),
        error => this.dialogService.alert(error.message)
      );
  }
}
