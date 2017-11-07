import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { SecurityGroup } from '../../sg.model';

@Component({
  selector: 'cs-security-group-card-item',
  templateUrl: 'security-group-card-item.component.html',
  styleUrls: ['security-group-card-item.component.scss']
})
export class SecurityGroupCardItemComponent implements OnChanges {
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
