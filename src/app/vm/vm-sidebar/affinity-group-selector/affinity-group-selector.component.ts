import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from '../../../dialog/dialog-module';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { AffinityGroup, AffinityGroupTypes } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services';
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
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    @Inject('virtualMachine') public vm: VirtualMachine
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
        type: AffinityGroupTypes.hostAntiAffinity
      })
      .switchMap(affinityGroup => {
        return this.affinityGroupService
          .updateForVm(this.vm, affinityGroup);
      })
      .finally(() => this.loading = false)
      .subscribe(
        vm => this.dialog.hide(vm.affinityGroup),
        error => this.dialogService.alert(error.message)
      );
  }

  public changeGroup(): void {
    this.loading = true;
    this.affinityGroupService
      .updateForVm(this.vm, this.selectedAffinityGroup)
      .finally(() => this.loading = false)
      .subscribe(
        vm => this.dialog.hide(vm.affinityGroup),
        error => this.dialogService.alert(error.message)
      );
  }

  public removeGroup(): void {
    this.loading = true;
    this.affinityGroupService
      .removeForVm(this.vm)
      .finally(() => this.loading = false)
      .subscribe(
        vm => this.dialog.hide(vm.affinityGroup),
        error => this.dialogService.alert(error.message)
      );
  }

  public onCancel(): void {
    this.dialog.hide();
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
