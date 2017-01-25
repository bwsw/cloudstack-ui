import {
  Component,
  Input
} from '@angular/core';

import { MdlDialogService } from 'angular2-mdl';
import { SecurityGroup } from '../../security-group/sg.model';
import { ServiceOfferingDialogComponent } from '../../service-offering/service-offering-dialog.component';
import { SgRulesComponent } from '../../security-group/sg-rules/sg-rules.component';
import { VirtualMachine } from '../vm.model';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-sidebar.component.html',
  styleUrls: ['vm-sidebar.component.scss']
})
export class VmDetailComponent {
  @Input() public vm: VirtualMachine;
  private expandNIC: boolean;
  private expandServiceOffering: boolean;

  constructor(
    private dialogService: MdlDialogService
  ) {
    this.expandNIC = false;
    this.expandServiceOffering = false;
  }

  public toggleNIC(): void {
    this.expandNIC = !this.expandNIC;
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
  }

  public showRulesDialog(securityGroup: SecurityGroup) {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      providers: [{ provide: 'securityGroup', useValue: securityGroup }],
      isModal: true,
      styles: { 'width': '880px' },
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
  }

  public openConsole(): void {
    window.open(
      `/client/console?cmd=access&vm=${this.vm.id}`,
      this.vm.displayName,
      'resizable=0,width=820,height=640'
    );
  }

  public changeServiceOffering() {
    this.dialogService.showCustomDialog({
      component: ServiceOfferingDialogComponent,
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
      isModal: true,
      styles: {
        'overflow': 'visible', // so that the dialog window doesn't cut the SO dropdown
        'width': '400px'
      },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
  }
}
