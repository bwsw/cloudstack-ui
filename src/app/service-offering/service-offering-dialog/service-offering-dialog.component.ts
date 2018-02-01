import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { debug } from 'util';
import {
  ServiceOffering,
  ServiceOfferingClass,
  ServiceOfferingType
} from '../../shared/models/service-offering.model';
import { Tag } from '../../shared/models/tag.model';
import { ResourceStats } from '../../shared/services/resource-usage.service';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmCreationState } from '../../vm/vm-creation/data/vm-creation-state';
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
export class ServiceOfferingDialogComponent implements OnInit, OnChanges {
  @Input() public formMode = ServiceOfferingFromMode.CHANGE;
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public classes: Array<ServiceOfferingClass>;
  @Input() public selectedClasses: Array<string>;
  @Input() public classTags: Array<Tag>;
  @Input() public serviceOfferingId: string;
  @Input() public viewMode: string;
  @Input() public virtualMachine: VirtualMachine;
  @Input() public vmCreationState: VmCreationState;
  @Input() public resourceUsage: ResourceStats;
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
    this.serviceOffering = this.serviceOffering || this.serviceOfferings.find(
      _ => _.id === this.serviceOfferingId);
    this.viewModeChange.emit(
      this.serviceOffering && this.serviceOffering.iscustomized
        ? ServiceOfferingType.custom
        : ServiceOfferingType.fixed);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const listChanges = changes.serviceOfferings;
    const vmStateChanges = changes.vmCreationState;
    if (listChanges && !this.vmCreationState) {
      this.serviceOffering = this.serviceOffering ||
        this.serviceOfferings.find(_ => _.id === this.serviceOfferingId);
    }

    if (vmStateChanges) {
      this.serviceOffering = this.vmCreationState.serviceOffering;
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

}
