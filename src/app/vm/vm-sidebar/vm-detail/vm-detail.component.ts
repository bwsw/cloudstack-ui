import { Component, Input, OnChanges } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import {
  AffinityGroupSelectorComponent
} from 'app/vm/vm-sidebar/affinity-group-selector/affinity-group-selector.component';
import { Observable } from 'rxjs/Observable';
import { DialogsService } from '../../../dialog/dialog-service/dialog.service';
import { AffinityGroup } from '../../../shared/models/affinity-group.model';
import { DateTimeFormatterService } from '../../../shared/services/date-time-formatter.service';
import { VmActionsService } from '../../shared/vm-actions.service';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';
import { SshKeypairResetComponent } from './../ssh/ssh-keypair-reset.component';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss']
})
export class VmDetailComponent implements OnChanges {
  @Input() public vm: VirtualMachine;
  public description: string;
  public expandServiceOffering: boolean;
  public affinityGroupLoading: boolean;
  public sskKeyLoading: boolean;


  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    private dialogsService: DialogsService,
    private dialog: MdDialog,
    private vmActionsService: VmActionsService,
    private vmService: VmService
  ) {
    this.expandServiceOffering = false;
  }

  public ngOnChanges(): void {
    this.update();
  }

    public changeDescription(newDescription: string): void {
    this.vmService
      .updateDescription(this.vm, newDescription)
      .onErrorResumeNext()
      .subscribe();
  }

  private setAffinityGroupLoading(value: boolean) {
    this.affinityGroupLoading = value;
  }

  private setSshKeyLoading(value: boolean) {
    this.sskKeyLoading = value;
  }

  public changeAffinityGroup(): void {
    this.askToStopVM(
      this.vm,
      'VM_PAGE.VM_DETAILS.AFFINITY_GROUP.STOP_MACHINE_FOR_AG',
      this.setAffinityGroupLoading.bind(this)
    )
      .filter(stopped => !!stopped)
      .subscribe(() => this.showAffinityGroupDialog());
  }

  public resetSshKey(): void {
    this.askToStopVM(
      this.vm,
      'VM_PAGE.VM_DETAILS.SSH_KEY.STOP_MACHINE_FOR_SSH',
      this.setSshKeyLoading.bind(this)
    )
      .filter(stopped => !!stopped)
      .subscribe(() => this.showSshKeypairResetDialog());
  }

  private update(): void {
    this.updateDescription();
  }

  private updateDescription(): void {
    this.vmService.getDescription(this.vm)
      .subscribe(description => {
        this.description = description;
      });
  }

  private askToStopVM(currentVM: VirtualMachine, message: string, loadingFunction: Function = () => {
  }): Observable<any> {
    loadingFunction(true);
    return this.vmService.get(currentVM.id)
      .do(() => loadingFunction(false))
      .switchMap(vm => {
        if (vm.state === VmState.Stopped) {
          return Observable.of(true);
        }

        return this.dialogsService.confirm({
          message: message,
          confirmText: 'VM_PAGE.COMMANDS.STOP',
          declineText: 'COMMON.CANCEL'
        })
          .onErrorResumeNext()
          .switchMap((res) => {
            if (res) {
              loadingFunction(true);
              return this.vmActionsService.vmStopActionSilent.activate(vm)
                .do(() => loadingFunction(false))
                .switchMap(() => Observable.of(true))
            } else {
              return Observable.of(false);
            }
          });
      });
  }

  private showAffinityGroupDialog(): void {
    this.dialog.open(AffinityGroupSelectorComponent, <MdDialogConfig>{
       width: '350px',
       data: this.vm,
       disableClose: true
     })
        .afterClosed()
        .subscribe((group?: Array<AffinityGroup>) => {
          if (group) {
            this.vm.affinityGroup = group;
          }
        });
  }

  private showSshKeypairResetDialog(): void {
    this.dialog.open(SshKeypairResetComponent, <MdDialogConfig>{
      width: '350px',
      data: this.vm,
      disableClose: true
    }).afterClosed()
      .subscribe((keyPairName: string) => {
        if (keyPairName) {
          this.vm.keyPair = keyPairName;
        }
      });
  }
}
