import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit {
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public zoneId: string;
  @Input() public serviceOfferingId: string;
  @Input() public restrictions: ICustomOfferingRestrictions;
  @Output() public onServiceOfferingChange = new EventEmitter<ServiceOffering>();
  public serviceOffering: ServiceOffering;
  public loading: boolean;


  public ngOnInit(): void {
    this.serviceOffering = this.serviceOfferings[0];
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
  }

  public onChange(): void {
    this.onServiceOfferingChange.emit(this.serviceOffering);
  }
}
