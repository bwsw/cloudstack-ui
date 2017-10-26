import {
  Component,
  Input
} from '@angular/core';
import { SecurityGroup } from '../sg.model';
import { ViewMode } from '../../shared/components/filter/filter-panel.component';
import { SecurityGroupCardItemComponent } from '../sg-list-item/card-item/security-group-card-item.component';
import { SecurityGroupRowItemComponent } from '../sg-list-item/row-item/security-group-row-item.component';


@Component({
  selector: 'cs-security-group-list',
  templateUrl: 'security-group-list.component.html'
})
export class SecurityGroupListComponent {
  @Input() public securityGroups: Array<SecurityGroup>;
  @Input() public query: string;
  @Input() public mode: ViewMode;

  public groupings = [];

  public inputs;
  public outputs;

  public SecurityGroupCardItemComponent = SecurityGroupCardItemComponent;
  public SecurityGroupRowItemComponent = SecurityGroupRowItemComponent;

  constructor( ) {
    this.inputs = {
      searchQuery: () => this.query
    }
  }
}
