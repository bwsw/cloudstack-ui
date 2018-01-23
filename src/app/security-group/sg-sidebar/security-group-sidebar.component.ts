import {
  Component,
  Input
} from '@angular/core';
import { SecurityGroup } from '../sg.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../services/security-group.service';

@Component({
  selector: 'cs-sg-sidebar',
  templateUrl: 'security-group-sidebar.component.html',
  styleUrls: ['security-group-sidebar.component.scss']
})
export class SecurityGroupSidebarComponent extends SidebarComponent<SecurityGroup> {
  @Input() public entity: SecurityGroup;

  constructor(
    protected sgService: SecurityGroupService,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(sgService, notificationService, route, router);
  }
}
