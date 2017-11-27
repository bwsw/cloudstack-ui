import {
  Component,
  Input
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { SecurityGroup, } from '../sg.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { SecurityGroupViewMode } from '../sg-filter/containers/sg-filter.container';
import { ListService } from '../../shared/components/list/list.service';


@Component({
  selector: 'cs-security-group-page',
  templateUrl: 'security-group-page.component.html',
  styleUrls: ['security-group-page.component.scss'],
  providers: [ListService]
})
export class SecurityGroupPageComponent {
  @Input() public securityGroups: Array<SecurityGroup>;
  @Input() public isLoading = false;
  @Input() public viewMode: SecurityGroupViewMode;
  @Input() public query: string;

  public mode: ViewMode;
  public viewModeKey = 'sgPageViewMode';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public listService: ListService
  ) {
  }

  public changeMode(mode) {
    this.mode = mode;
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

}
