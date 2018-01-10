import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ServiceOfferingGroup,
  ServiceOfferingType
} from '../../shared/models/service-offering.model';
import { Language } from '../../shared/services/language.service';

@Component({
  selector: 'cs-service-offering-filter',
  templateUrl: 'service-offering-filter.component.html'
})
export class ServiceOfferingFilterComponent {
  @Input() public groups: Array<ServiceOfferingGroup>;
  @Input() public selectedGroups: ServiceOfferingGroup[];
  @Input() public query: string;
  @Input() public viewMode: string;
  @Input() public groupings: Array<any>;
  @Input() public selectedGroupings: Array<any>;
  @Output() public groupingsChange = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();
  @Output() public queryChange = new EventEmitter();
  @Output() public selectedGroupsChange = new EventEmitter();

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
}
