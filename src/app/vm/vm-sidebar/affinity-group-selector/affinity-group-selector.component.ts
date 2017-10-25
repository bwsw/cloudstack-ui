import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';

import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-affinity-group-selector',
  templateUrl: 'affinity-group-selector.component.html',
  styleUrls: ['affinity-group-selector.component.scss']
})
export class AffinityGroupSelectorComponent implements OnInit {
  public affinityGroups: Array<AffinityGroup>;
  public loading: boolean;
  public selectedAffinityGroupName: string;

  constructor(
    private affinityGroupService: AffinityGroupService,
    private dialogRef: MatDialogRef<AffinityGroupSelectorComponent>,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public vm: VirtualMachine
  ) {}

  public ngOnInit(): void {
    this.loadGroups();
  }

  public get groupName(): string {
    return this.vm.affinityGroup.length && this.vm.affinityGroup[0].name;
  }

  public get groupNames(): Array<string> {
    return this.affinityGroups.map(_ => _.name);
  }

  public get selectedAffinityGroup(): AffinityGroup {
    return this.affinityGroups.find(_ => _.name === this.selectedAffinityGroupName);
  }

  public createGroup(name: string): void {
    this.loading = true;
    this.affinityGroupService
      .create({
        name,
        type: AffinityGroupType.hostAntiAffinity
      })
      .switchMap(affinityGroup => {
        return this.affinityGroupService
          .updateForVm(this.vm, affinityGroup);
      })
      .finally(() => this.loading = false)
      .subscribe(
        vm => this.dialogRef.close(vm.affinityGroup),
        error => this.dialogService.alert({ message: error.message })
      );
  }

  public changeGroup(name: string): void {
    this.loading = true;
    this.selectedAffinityGroupName = name;
    this.affinityGroupService
      .updateForVm(this.vm, this.selectedAffinityGroup)
      .finally(() => this.loading = false)
      .subscribe(
        vm => this.dialogRef.close(vm.affinityGroup),
        error => this.dialogService.alert({ message: error.message })
      );
  }

  public removeGroup(): void {
    this.loading = true;
    this.affinityGroupService
      .removeForVm(this.vm)
      .finally(() => this.loading = false)
      .subscribe(
        vm => this.dialogRef.close(vm.affinityGroup),
        error => this.dialogService.alert({ message: error.message })
      );
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private loadGroups(): void {
    this.loading = true;
    this.affinityGroupService.getList()
      .finally(() => this.loading = false)
      .subscribe(groups => {
        this.affinityGroups = groups;
      });
  }
}
