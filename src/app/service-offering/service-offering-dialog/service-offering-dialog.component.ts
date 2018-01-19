import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnChanges {
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public serviceOfferingId: string;
  @Input() public restrictions: ICustomOfferingRestrictions;
  @Input() public isVmRunning: boolean;
  @Input() public isLoading: boolean;
  @Output() public onServiceOfferingChange = new EventEmitter<ServiceOffering>();
  public serviceOffering: ServiceOffering;

  public ngOnChanges(changes: SimpleChanges) {
    if (this.serviceOfferings.length) {
      const serviceOffering = this.serviceOfferings
        .find((offering: ServiceOffering) => offering.id === this.serviceOfferingId);
      this.updateOffering(serviceOffering);
    }
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
  }

  public onChange(): void {
    this.onServiceOfferingChange.emit(this.serviceOffering);
  }
}
