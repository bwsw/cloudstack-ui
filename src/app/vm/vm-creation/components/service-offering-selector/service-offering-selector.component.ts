import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ServiceOffering } from '../../../../shared/models';
import { ComputeOfferingViewModel } from '../../../view-models';
// tslint:disable-next-line
import { VmCreationServiceOfferingContainerComponent } from '../../service-offering/vm-creation-service-offering.container';

@Component({
  selector: 'cs-service-offering-selector',
  templateUrl: 'service-offering-selector.component.html',
  styleUrls: ['service-offering-selector.component.scss'],
})
export class ServiceOfferingSelectorComponent {
  @Input()
  public serviceOfferings: Array<ComputeOfferingViewModel>;
  @Output()
  public change: EventEmitter<ServiceOffering>;

  private _serviceOffering: ServiceOffering;

  constructor(private dialog: MatDialog, private translateService: TranslateService) {
    this.change = new EventEmitter();
  }

  @Input()
  public get serviceOffering(): ServiceOffering {
    return this._serviceOffering;
  }

  public set serviceOffering(serviceOffering: ServiceOffering) {
    this._serviceOffering = serviceOffering;
  }

  public onClick() {
    this.dialog
      .open(VmCreationServiceOfferingContainerComponent, <MatDialogConfig>{
        width: '700px',
        disableClose: true,
        data: {
          serviceOffering: this.serviceOffering,
        },
      })
      .afterClosed()
      .pipe(filter(res => Boolean(res)))
      .subscribe(offering => {
        this.serviceOffering = offering;
        this.change.next(this.serviceOffering);
      });
  }

  public get offeringName(): Observable<string> {
    if (!this.serviceOffering) {
      return of('');
    }

    return this.translateService
      .get(['UNITS.MB', 'UNITS.MHZ', 'VM_PAGE.VM_CREATION.SERVICE_OFFERING'])
      .pipe(
        map(translations => {
          if (!this.serviceOffering.iscustomized) {
            return `${translations['VM_PAGE.VM_CREATION.SERVICE_OFFERING']}: ${
              this.serviceOffering.name
            }`;
          } else {
            const cpuNumber = this.serviceOffering.cpunumber;
            const cpuSpeed = this.serviceOffering.cpuspeed;
            const memory = this.serviceOffering.memory;
            return (
              `${translations['VM_PAGE.VM_CREATION.SERVICE_OFFERING']}: ${
                this.serviceOffering.name
              } - ` +
              `${cpuNumber}x${cpuSpeed} ${translations['UNITS.MHZ']}, ${memory} ${
                translations['UNITS.MB']
              }`
            );
          }
        })
      );
  }
}
