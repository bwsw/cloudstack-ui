import { Component, Input, OnChanges } from '@angular/core';
import {
  AffinityGroupSelectorComponent
} from 'app/vm/vm-sidebar/affinity-group-selector/affinity-group-selector.component';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { AffinityGroup } from '../../../shared/models/affinity-group.model';
import { DateTimeFormatterService } from '../../../shared/services/date-time-formatter.service';
import { VmActionsService } from '../../shared/vm-actions.service';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';
import { SshKeypairResetComponent } from '../ssh/ssh-keypair-reset.component';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';


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
    private dialogService: DialogService,
    private vmActionsService: VmActionsService,
    private vmService: VmService,
    private vmTagService: VmTagService
  ) {
    this.expandServiceOffering = false;
  }

  public ngOnChanges(): void {
    this.update();
  }

  public changeDescription(newDescription: string): void {
    this.vmTagService.setDescription(this.vm, newDescription)
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
    this.vmTagService.getDescription(this.vm)
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

        return this.dialogService.customConfirm({
          message: message,
          confirmText: 'VM_PAGE.COMMANDS.STOP',
          declineText: 'COMMON.CANCEL',
          width: '350px',
          clickOutsideToClose: false
        })
          .onErrorResumeNext()
          .switchMap((result) => {
            if (result === null) {
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
    this.dialogService.showCustomDialog({
      component: AffinityGroupSelectorComponent,
      styles: { width: '350px' },
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
      clickOutsideToClose: false
    }).switchMap(dialog => dialog.onHide())
      .subscribe((group?: Array<AffinityGroup>) => {
        if (group) {
          this.vm.affinityGroup = group;
        }
      });
  }

  private showSshKeypairResetDialog(): void {
    this.dialogService.showCustomDialog({
      component: SshKeypairResetComponent,
      styles: { width: '350px' },
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
      clickOutsideToClose: false
    }).switchMap(dialog => dialog.onHide())
      .subscribe((keyPairName: string) => {
        if (keyPairName) {
          this.vm.keyPair = keyPairName;
        }
      });
  }
}
