import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { resourceTypeNames } from '../../utils/resource-type-names';

@Component({
  selector: 'cs-request-resources',
  templateUrl: 'request-resources.component.html',
  styleUrls: ['request-resources.component.scss'],
})
export class RequestResourcesComponent {
  @Input()
  resourceQuotas: {
    [resourceType: number]: {
      minimum: number;
      maximum: number;
    };
  };

  @Input()
  resourceLimits: {
    [resourceType: number]: number;
  };

  @Output()
  limitChange = new EventEmitter();

  @Output()
  update = new EventEmitter();

  public resourceQuotaNames = resourceTypeNames;

  public onLimitChange(resourceType: number, limit: number) {
    this.limitChange.emit({
      resourceType,
      limit,
    });
  }

  public onUpdate() {
    this.update.emit();
  }
}
