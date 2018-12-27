import { Component, Input } from '@angular/core';
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

  public resourceQuotaNames = resourceTypeNames;
}
