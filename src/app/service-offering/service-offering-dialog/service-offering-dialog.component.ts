import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  ICustomOfferingRestrictions,
  ServiceOffering,
  ServiceOfferingClass,
  ServiceOfferingType
} from '../../shared/models';
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
export class ServiceOfferingDialogComponent implements OnInit, OnChanges {
  @Input() public formMode = ServiceOfferingFromMode.CHANGE;
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public classes: Array<ServiceOfferingClass>;
  @Input() public selectedClasses: Array<string>;
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
  public showFields = false;

  public ngOnInit() {
    this.serviceOffering = this.serviceOfferings.find(_ => _.id === this.serviceOfferingId);
    if (!this.serviceOffering) {
      this.viewMode === ServiceOfferingType.fixed ? this.viewModeChange.emit(ServiceOfferingType.custom) :
        this.viewModeChange.emit(ServiceOfferingType.fixed);
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    const listChanges = changes.serviceOfferings;
    if (listChanges) {
      this.serviceOffering = this.serviceOffering ||
        this.serviceOfferings.find(_ => _.id === this.serviceOfferingId);
    }
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
    this.onServiceOfferingUpdate.emit(this.serviceOffering);
  }

  public onChange(): void {
    this.onServiceOfferingChange.emit(this.serviceOffering);
  }

  public get showRebootMessage(): boolean {
    return !this.formMode &&
      this.serviceOfferings.length &&
      this.serviceOffering && this.serviceOffering.id !== this.serviceOfferingId
      && this.isVmRunning;
  }

  public get disableSubmitButton(): boolean {
    return !this.serviceOffering ||
      !this.serviceOffering.iscustomized && this.serviceOffering.id === this.serviceOfferingId ||
      this.serviceOffering.iscustomized && !this.serviceOffering.cpuspeed
      && !this.serviceOffering.cpunumber && !this.serviceOffering.memory;
  }

}
