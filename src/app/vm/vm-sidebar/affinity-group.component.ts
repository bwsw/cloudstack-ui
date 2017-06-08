import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { AffinityGroupService } from '../../shared/services/affinity-group.service';
import { VirtualMachine } from '../shared/vm.model';

@Component({
  selector: 'cs-affinity-group',
  templateUrl: 'affinity-group.component.html'
})
export class AffinityGroupComponent implements OnInit {
  public affinityGroups: Array<AffinityGroup>;
  public selectedAffinityGroup: string;

  constructor(
    private affinityGroupService: AffinityGroupService,
    private dialog: MdlDialogReference,
    @Inject('virtualMachine') public vm: VirtualMachine
  ) { }

  public ngOnInit(): void {
    this.affinityGroupService.getList()
      .subscribe(groups => {
        this.affinityGroups = groups.filter(_ => !this.vm.affinityGroup.some(ag => ag.id === _.id));
        if (this.affinityGroups.length) {
          this.selectedAffinityGroup = this.affinityGroups[0].id;
        }
      });
  }

  public hide(): void {
    this.dialog.hide();
  }

  public changeAffinityGroup(): void {
    this.affinityGroupService.updateForVm(this.vm, this.selectedAffinityGroup)
      .subscribe(vm => {
        this.dialog.hide(vm.affinityGroup);
      });
  }
}
