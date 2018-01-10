import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { ServiceOffering } from '../../shared/models/service-offering.model';

@Component({
  selector: 'cs-service-offering-item',
  templateUrl: 'service-offering-item.component.html',
  styleUrls: ['service-offering-item.component.scss']
})
export class ServiceOfferingItemComponent implements OnChanges {
  @Input() public item: ServiceOffering;
  @Input() public searchQuery: () => string;
  @Input() public isSelected: (serviceOffering) => boolean;
  @Output() public onClick = new EventEmitter();

  public query: string;

  public ngOnChanges(changes: SimpleChanges): void {
    const query = changes.searchQuery;
    if (query) {
      this.query = this.searchQuery();
    }
  }
}
