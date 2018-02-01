import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { classesFilter } from '../../reducers/service-offerings/redux/service-offerings.reducers';
import {
  ServiceOffering,
  ServiceOfferingClass
} from '../../shared/models/service-offering.model';
import { Tag } from '../../shared/models/tag.model';
import { Language } from '../../shared/services/language.service';
import { ResourceStats } from '../../shared/services/resource-usage.service';
import { VirtualMachine } from '../../vm/shared/vm.model';
import {
  DefaultCustomServiceOfferingRestrictions,
  ICustomOfferingRestrictions
} from '../custom-service-offering/custom-offering-restrictions';
import {
  CustomServiceOffering,
  ICustomServiceOffering
} from '../custom-service-offering/custom-service-offering';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';
import * as merge from 'lodash/merge';

@Component({
  selector: 'cs-service-offering-list',
  templateUrl: 'service-offering-list.component.html',
  styleUrls: ['service-offering-list.component.scss']
})
export class ServiceOfferingListComponent implements OnChanges {
  @Input() public offeringList: Array<ServiceOffering>;
  @Input() public classes: Array<ServiceOfferingClass>;
  @Input() public selectedClasses: Array<string>;
  @Input() public classTags: Array<Tag>;
  @Input() public query: string;
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public resourceUsage: ResourceStats;
  @Input() public virtualMachine: VirtualMachine;
  @Input() public defaultParams: ICustomServiceOffering;
  @Input() public selectedOffering: ServiceOffering;
  @Input() public isLoading = false;
  @Output() public selectedOfferingChange = new EventEmitter();

  public list: Array<{ soClass: ServiceOfferingClass, items: Array<ServiceOffering> }>;

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
  }

  public ngOnChanges(changes): void {
    this.getGroupedOfferings();
  }

  public selectOffering(offering: ServiceOffering): void {
    if (offering.iscustomized) {
      this.showCustomOfferingDialog(
        offering,
        this.customOfferingRestrictions,
        this.defaultParams
      )
        .filter(res => Boolean(res))
        .subscribe(customOffering => {
          this.selectedOffering = customOffering;
          this.selectedOfferingChange.emit(this.selectedOffering);
        });
    } else if (this.isAvailable(offering)) {
      this.selectedOffering = offering;
      this.selectedOfferingChange.emit(this.selectedOffering);
    }
  }

  private showCustomOfferingDialog(
    offering: ServiceOffering,
    restriction: ICustomOfferingRestrictions,
    defaultParams: ICustomServiceOffering
  ): Observable<CustomServiceOffering> {
    return this.dialog.open(CustomServiceOfferingComponent, {
      width: '370px',
      data: {
        offering,
        defaultParams,
        restriction
      }
    }).afterClosed();

  }

  public get locale(): Language {
    return this.translateService.currentLang as Language;
  }

  public getDescription(soClass: ServiceOfferingClass) {
    return soClass && soClass.description
      && soClass.description[this.locale];
  }

  public getName(soClass: ServiceOfferingClass) {
    return soClass && soClass.name
      && soClass.name[this.locale] || 'SERVICE_OFFERING.FILTERS.COMMON';
  }

  public getGroupedOfferings() {
    const showClasses = this.classes
      .filter(soClass => this.selectedClasses.indexOf(soClass.id) > -1);
    if (this.classes.length) {
      this.list = (showClasses.length ? showClasses : this.classes)
        .map(soClass => {
          return {
            soClass,
            items: this.filterOfferings(this.offeringList, soClass)
          };
        });
    } else {
      this.list = [{ soClass: null, items: this.offeringList }];
    }
  }

  public filterOfferings(list: ServiceOffering[], soClass: ServiceOfferingClass) {
    const classesMap = [soClass].reduce((m, i) => ({ ...m, [i.id]: i }), {});
    return list.filter(offering => classesFilter(offering, this.classTags, classesMap));
  }

  public isAvailable(serviceOffering: ServiceOffering): boolean {
    const resources = this.enoughResources(serviceOffering);
    return resources.enoughCPU && resources.enoughMemory;
  }

  public serviceOfferingTooltip(serviceOffering: ServiceOffering): string {
    const resources = this.enoughResources(serviceOffering);
    const tooltips = {
      memory: 'SERVICE_OFFERING.TOOLTIPS.NOT_ENOUGH_MEMORY',
      cpu: 'SERVICE_OFFERING.TOOLTIPS.NOT_ENOUGH_CPU',
      cpuMemory: 'SERVICE_OFFERING.TOOLTIPS.NOT_ENOUGH_MEMORY_AND_CPU'
    };


    if (!resources.enoughMemory) {
      if (!resources.enoughCPU) {
        return tooltips.cpuMemory;
      }
      return tooltips.memory;
    } else if (!resources.enoughCPU) {
      return tooltips.cpu;
    }
  }

  public enoughResources(serviceOffering: ServiceOffering): ResourceAvailability {
    return checkAvailabilityOfResources(
      serviceOffering,
      this.resourceUsage,
      this.virtualMachine
    );
  }
}

export interface ResourceAvailability {
  enoughCPU: boolean,
  enoughMemory: boolean
}

export const checkAvailabilityOfResources = (
  serviceOffering: ServiceOffering,
  resourceUsage: ResourceStats,
  virtualMachine?: VirtualMachine
): ResourceAvailability => {
  if (resourceUsage && !serviceOffering.iscustomized) {
    let enoughCpus;
    let enoughMemory;

    const maxCpu = resourceUsage && (virtualMachine
      ? resourceUsage.available.cpus - virtualMachine.cpuNumber
      : resourceUsage.available.cpus);
    const maxMemory = resourceUsage && (virtualMachine
      ? resourceUsage.available.memory - virtualMachine.memory
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

    return { enoughCPU: enoughCpus, enoughMemory: enoughMemory };
  }

  return { enoughCPU: true, enoughMemory: true };
};
