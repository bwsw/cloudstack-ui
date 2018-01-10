import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ServiceOffering,
  ServiceOfferingGroup
} from '../../shared/models/service-offering.model';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';

export enum ServiceOfferingFromMode {
  CHANGE,
  SELECT
}

@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit {
  @Input() public formMode = ServiceOfferingFromMode.CHANGE;
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public groups: Array<ServiceOfferingGroup>;
  @Input() public serviceOfferingId: string;
  @Input() public viewMode: string;
  @Input() public restrictions: ICustomOfferingRestrictions;
  @Input() public groupings: Array<any>;
  @Input() public selectedGroupings: Array<any>;
  @Output() public onServiceOfferingChange = new EventEmitter<ServiceOffering>();
  @Output() public onServiceOfferingUpdate = new EventEmitter<ServiceOffering>();
  @Output() public viewModeChange = new EventEmitter();
  @Output() public selectedGroupsChange = new EventEmitter();
  @Output() public queryChange = new EventEmitter();
  public serviceOffering: ServiceOffering;
  public loading: boolean;

  public ngOnInit() {
    if (this.serviceOfferings.length) {
      this.serviceOffering = this.serviceOfferings.find(_ => _.id === this.serviceOfferingId);
    }
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
    this.onServiceOfferingUpdate.emit(this.serviceOffering);
  }

  public onChange(): void {
    this.onServiceOfferingChange.emit(this.serviceOffering);
  }


}
