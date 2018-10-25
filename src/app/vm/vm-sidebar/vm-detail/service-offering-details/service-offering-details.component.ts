import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import * as moment from 'moment';
import { ServiceOffering } from '../../../../shared/models/service-offering.model';
import { ServiceOfferingDialogContainerComponent } from '../../../container/service-offering-dialog.container';
import { VirtualMachine, VmState } from '../../../shared/vm.model';

@Component({
  selector: 'cs-service-offering-details',
  templateUrl: 'service-offering-details.component.html',
  styleUrls: ['service-offering-details.component.scss'],
})
export class ServiceOfferingDetailsComponent {
  @Input()
  public offering: ServiceOffering;
  @Input()
  public vm: VirtualMachine;

  public expandServiceOffering: boolean;

  constructor(private dialog: MatDialog) {
    this.expandServiceOffering = false;
  }

  public changeServiceOffering(): void {
    this.dialog
      .open(ServiceOfferingDialogContainerComponent, {
        width: '700px',
        disableClose: true,
        data: { vm: this.vm },
      } as MatDialogConfig)
      .afterClosed();
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
  }

  public get offeringCreated(): Date {
    return this.offering && this.offering.created && moment(this.offering.created).toDate();
  }

  public get canActivate() {
    return this.vm.state !== VmState.InProgress;
  }
}
