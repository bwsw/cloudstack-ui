import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ServiceOffering,
  ServiceOfferingClass
} from '../../shared/models/service-offering.model';
import { Tag } from '../../shared/models/tag.model';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';
import { ICustomServiceOffering } from '../custom-service-offering/custom-service-offering';

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
  @Input() public classes: Array<ServiceOfferingClass>;
  @Input() public selectedClasses: Array<string>;
  @Input() public classTags: Array<Tag>;
  @Input() public serviceOfferingId: string;
  @Input() public viewMode: string;
  @Input() public restrictions: ICustomOfferingRestrictions;
  @Input() public defaultParams: ICustomServiceOffering;
  @Input() public groupings: Array<any>;
  @Input() public query: string;
  @Input() public isVmRunning: boolean;
  @Output() public onServiceOfferingChange = new EventEmitter<ServiceOffering>();
  @Output() public onServiceOfferingUpdate = new EventEmitter<ServiceOffering>();
  @Output() public viewModeChange = new EventEmitter();
  @Output() public selectedClassesChange = new EventEmitter();
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
