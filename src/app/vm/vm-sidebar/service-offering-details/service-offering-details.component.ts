import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {
  ServiceOfferingDialogComponent
} from '../../../service-offering/service-offering-dialog/service-offering-dialog.component';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { ServiceOfferingService } from '../../../shared/services/service-offering.service';
import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-service-offering-details',
  templateUrl: 'service-offering-details.component.html',
  styleUrls: ['service-offering-details.component.scss']
})
export class ServiceOfferingDetailsComponent {
  @Input() public vm: VirtualMachine;

  public expandServiceOffering: boolean;

  constructor(
    private dialog: MatDialog,
    private serviceOfferingService: ServiceOfferingService
  ) {
    this.expandServiceOffering = false;
  }

  public changeServiceOffering(): void {
    this.dialog.open(ServiceOfferingDialogComponent, <MatDialogConfig>{
      width: '350px',
      data: { virtualMachine: this.vm },
      disableClose: true
    })
      .afterClosed()
      .subscribe((newOffering: ServiceOffering) => {
        if (newOffering) {
          this.serviceOfferingService.get(newOffering.id).subscribe(offering => {
            this.vm.serviceOffering = offering;
            this.vm.serviceOfferingId = offering.id;
          });
        }
      });
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
  }
}
