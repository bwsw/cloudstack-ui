import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { ResourceStats } from '../../shared/services/resource-usage.service';
import { VirtualMachine } from '../../vm/shared/vm.model';
import {
  areCustomParamsSet,
  CustomServiceOffering
} from '../custom-service-offering/custom-service-offering';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';
import {
  DefaultCustomServiceOfferingRestrictions,
  ICustomOfferingRestrictions
} from '../custom-service-offering/custom-offering-restrictions';
import * as merge from 'lodash';

export const isServiceOfferingDisabled = (
  serviceOffering: ServiceOffering,
  resourceUsage: ResourceStats,
  virtualMachine?: VirtualMachine
): boolean => {
  if (resourceUsage) {
    let enoughCpus;
    let enoughMemory;

    const maxCpu = resourceUsage && (virtualMachine
      ? resourceUsage.available.cpus + virtualMachine.cpuNumber
      : resourceUsage.available.cpus);
    const maxMemory = resourceUsage && (virtualMachine
      ? resourceUsage.available.memory + virtualMachine.memory
      : resourceUsage.available.memory);

    if (serviceOffering.iscustomized) {
      const restrictions = merge(
        DefaultCustomServiceOfferingRestrictions,
        this.customOfferingRestrictions
      );
      enoughCpus = !restrictions.cpunumber || restrictions.cpunumber.min < maxCpu;
      enoughMemory = !restrictions.memory || restrictions.memory.min < maxMemory;
    } else {
      enoughCpus = maxCpu >= serviceOffering.cpunumber;
      enoughMemory = maxMemory >= serviceOffering.memory;
    }

    return !enoughCpus || !enoughMemory;
  }

  return false;
};


@Component({
  selector: 'cs-service-offering-selector',
  templateUrl: 'service-offering-selector.component.html',
  styleUrls: ['service-offering-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceOfferingSelectorComponent),
      multi: true
    }
  ]
})
export class ServiceOfferingSelectorComponent implements ControlValueAccessor {
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public resourceUsage: ResourceStats;
  @Input() public virtualMachine: VirtualMachine;
  @Output() public change: EventEmitter<ServiceOffering>;

  private _serviceOffering: ServiceOffering;
  private previousOffering: ServiceOffering;

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.change = new EventEmitter();
  }

  @Input()
  public get serviceOffering(): ServiceOffering {
    return this._serviceOffering;
  }

  public set serviceOffering(serviceOffering: ServiceOffering) {
    this._serviceOffering = serviceOffering;
    this.propagateChange(this.serviceOffering);
  }

  public get customOfferingDescription(): Observable<string> {
    if (!this.serviceOffering || !this.serviceOffering.iscustomized || !areCustomParamsSet(
        this.serviceOffering)) {
      return Observable.of('');
    }

    const cpuNumber = this.serviceOffering.cpunumber;
    const cpuSpeed = this.serviceOffering.cpuspeed;
    const memory = this.serviceOffering.memory;

    return this.translateService.get(['UNITS.MB', 'UNITS.MHZ'])
      .map(translations => {
        return `${cpuNumber}x${cpuSpeed} ${translations['UNITS.MHZ']}, ${memory} ${translations['UNITS.MB']}`;
      });
  }

  public changeOffering(change: MatSelectChange): void {
    const newOffering = this.serviceOfferings.find(_ => _.id === change.value);
    this.saveOffering();
    this.serviceOffering = newOffering;
    if (newOffering.iscustomized) {
      this.showCustomOfferingDialog()
        .subscribe(customOffering => {
          this.setCustomOffering(customOffering);
          this.change.next(this.serviceOffering);
        });
    } else {
      this.change.next(this.serviceOffering);
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
  }

  public propagateChange: any = () => {
  };

  public writeValue(serviceOffering: ServiceOffering): void {
    if (serviceOffering) {
      this.serviceOffering = serviceOffering;
    }
  }

  public isDisabled(serviceOffering) {
    return isServiceOfferingDisabled(
      serviceOffering,
      this.resourceUsage,
      this.virtualMachine
    );
  }

  private setCustomOffering(customOffering: CustomServiceOffering): void {
    if (customOffering) {
      this.updateCustomOfferingInList(customOffering);
      this.serviceOffering = customOffering;
    } else {
      this.restorePreviousOffering();
    }
  }

  private updateCustomOfferingInList(customOffering: CustomServiceOffering): void {
    this.serviceOfferings = this.serviceOfferings.map(offering => {
      if (offering.id === customOffering.id) {
        return customOffering;
      } else {
        return offering;
      }
    });
    this.cd.detectChanges();
  }

  private showCustomOfferingDialog(): Observable<CustomServiceOffering> {
    return this.dialog.open(CustomServiceOfferingComponent, {
      width: '370px',
      data: {
        offering: this.serviceOffering,
        restriction: this.customOfferingRestrictions
      }
    }).afterClosed();

  }

  private saveOffering(): void {
    this.previousOffering = this.serviceOffering;
  }

  private restorePreviousOffering(): void {
    this.serviceOffering = this.previousOffering;
  }
}
