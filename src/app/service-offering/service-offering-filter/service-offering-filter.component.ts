import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ServiceOfferingClass, ServiceOfferingType } from '../../shared/models';
import { Language } from '../../shared/types';

@Component({
  selector: 'cs-service-offering-filter',
  templateUrl: 'service-offering-filter.component.html',
  styleUrls: ['service-offering-filter.component.scss']
})
export class ServiceOfferingFilterComponent {
  @Input() public classes: Array<ServiceOfferingClass>;
  @Input() public selectedClasses: ServiceOfferingClass[];
  @Input() public query: string;
  @Input() public viewMode: string;
  @Output() public viewModeChange = new EventEmitter<string>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public selectedClassesChange = new EventEmitter<Array<ServiceOfferingClass>>();

  constructor(
    private translate: TranslateService
  ) {
  }

  public setMode(mode: string): void {
    this.viewModeChange.emit(mode);
  }

  public get ServiceOfferingType() {
    return ServiceOfferingType;
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public getName(soClass: ServiceOfferingClass) {
    return soClass && soClass.name
      && soClass.name[this.locale] || 'SERVICE_OFFERING.FILTERS.COMMON';
  }
}
