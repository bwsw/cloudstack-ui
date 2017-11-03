import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { SecurityGroup } from '../../sg.model';

@Component({
  selector: 'cs-security-group-row-item',
  templateUrl: 'security-group-row-item.component.html',
  styleUrls: ['security-group-row-item.component.scss']
})
export class SecurityGroupRowItemComponent implements OnChanges {
  @Input() public item: SecurityGroup;
  @Input() public searchQuery: () => string;

  public query: string;

  public ngOnChanges(changes: SimpleChanges): void {
    const query = changes.searchQuery;
    if (query) {
      this.query = this.searchQuery();
    }
  }
}
