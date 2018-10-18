import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ComputeOfferingClass, serviceOfferingType } from '../../shared/models';
import { ComputeOfferingViewModel } from '../../vm/view-models';
import { VirtualMachine } from '../../vm/shared/vm.model';

export enum ServiceOfferingFromMode {
  CHANGE,
  SELECT,
}

@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit, OnChanges {
  @Input()
  public formMode = ServiceOfferingFromMode.CHANGE;
  @Input()
  public serviceOfferings: ComputeOfferingViewModel[];
  @Input()
  public classes: ComputeOfferingClass[];
  @Input()
  public selectedClasses: string[];
  @Input()
  public serviceOfferingId: string;
  @Input()
  public viewMode: string;
  @Input()
  public virtualMachine: VirtualMachine;
  @Input()
  public groupings: any[];
  @Input()
  public query: string;
  @Input()
  public account: Account;
  @Input()
  public isVmRunning: boolean;
  @Output()
  public serviceOfferingChanged = new EventEmitter<ComputeOfferingViewModel>();
  @Output()
  public serviceOfferingUpdated = new EventEmitter<ComputeOfferingViewModel>();
  @Output()
  public viewModeChanged = new EventEmitter();
  @Output()
  public selectedClassesChanged = new EventEmitter();
  @Output()
  public queryChange = new EventEmitter();
  public serviceOffering: ComputeOfferingViewModel;
  public loading: boolean;
  public showFields = false;

  public ngOnInit() {
    this.serviceOffering = this.serviceOfferings.find(_ => _.id === this.serviceOfferingId);
    if (!this.serviceOffering) {
      this.viewMode === serviceOfferingType.fixed
        ? this.viewModeChanged.emit(serviceOfferingType.custom)
        : this.viewModeChanged.emit(serviceOfferingType.fixed);
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    const listChanges = changes.serviceOfferings;
    if (listChanges) {
      this.serviceOffering =
        this.serviceOffering || this.serviceOfferings.find(_ => _.id === this.serviceOfferingId);
    }
  }

  public updateOffering(offering: ComputeOfferingViewModel): void {
    this.serviceOffering = offering;
    this.serviceOfferingUpdated.emit(this.serviceOffering);
  }

  public onChange(): void {
    this.serviceOfferingChanged.emit(this.serviceOffering);
  }

  public get showRebootMessage(): boolean {
    return (
      !this.formMode &&
      this.serviceOfferings.length &&
      this.isSelectedOfferingDifferent() &&
      this.isVmRunning
    );
  }

  public isSubmitButtonDisabled(): boolean {
    const isOfferingNotSelected = !this.serviceOffering;
    const isNoOfferingsInCurrentViewMode = !this.serviceOfferings.length;
    const isNotEnoughResourcesForCurrentOffering =
      this.serviceOffering && !this.serviceOffering.isAvailableByResources;
    const isSelectedOfferingFromDifferentViewMode =
      this.serviceOffering &&
      this.serviceOffering.iscustomized !== (this.viewMode === serviceOfferingType.custom);
    const isSelectedOfferingDoNotHaveParams =
      this.serviceOffering &&
      !this.serviceOffering.cpunumber &&
      !this.serviceOffering.cpuspeed &&
      !this.serviceOffering.memory;

    const isSelectedOfferingDifferentFromCurrent =
      this.formMode === ServiceOfferingFromMode.CHANGE && !this.isSelectedOfferingDifferent();

    return (
      isOfferingNotSelected ||
      isNoOfferingsInCurrentViewMode ||
      isSelectedOfferingFromDifferentViewMode ||
      isSelectedOfferingDoNotHaveParams ||
      isSelectedOfferingDifferentFromCurrent ||
      isNotEnoughResourcesForCurrentOffering
    );
  }

  public isSelectedOfferingViewMode(): boolean {
    if (
      this.serviceOffering &&
      this.serviceOffering.iscustomized &&
      this.viewMode === serviceOfferingType.custom
    ) {
      return true;
    }
    if (
      this.serviceOffering &&
      !this.serviceOffering.iscustomized &&
      this.viewMode === serviceOfferingType.fixed
    ) {
      return true;
    }
    return false;
  }

  private isSelectedOfferingDifferent(): boolean {
    if (!this.virtualMachine || !this.serviceOffering) {
      return true;
    }

    const isDifferentOfferingId = this.virtualMachine.serviceofferingid !== this.serviceOffering.id;
    const isSameCustomOfferingWithDifferentParams =
      !isDifferentOfferingId &&
      (this.virtualMachine.cpunumber !== this.serviceOffering.cpunumber ||
        this.virtualMachine.cpuspeed !== this.serviceOffering.cpuspeed ||
        this.virtualMachine.memory !== this.serviceOffering.memory);

    return isDifferentOfferingId || isSameCustomOfferingWithDifferentParams;
  }
}
