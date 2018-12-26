import { Component, EventEmitter, Input, Output } from '@angular/core';
import { resourceTypeNames } from '../../utils/resource-type-names';

@Component({
  selector: 'cs-resource-quotas',
  templateUrl: 'resource-quotas.component.html',
  styleUrls: ['resource-quotas.component.scss'],
})
export class ResourceQuotasComponent {
  @Input()
  resourceQuotas: {
    [resourceType: number]: {
      minimum: number;
      maximum: number;
    };
  };

  @Output()
  fieldChange = new EventEmitter();

  @Output()
  update = new EventEmitter();

  public resourceQuotaNames = resourceTypeNames;

  public onMinChange(resourceType: number, minimum: number) {
    this.fieldChange.emit({
      resourceType,
      minimum,
    });
  }

  public onMaxChange(resourceType: number, maximum: number) {
    this.fieldChange.emit({
      resourceType,
      maximum,
    });
  }

  public onUpdate() {
    this.update.emit();
  }
}
