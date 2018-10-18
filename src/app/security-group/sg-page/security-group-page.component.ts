import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SecurityGroup } from '../sg.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { ListService } from '../../shared/components/list/list.service';
import { SecurityGroupViewMode } from '../sg-view-mode';
import { VirtualMachine } from '../../vm';
import { NgrxEntities } from '../../shared/interfaces';

@Component({
  selector: 'cs-security-group-page',
  templateUrl: 'security-group-page.component.html',
  styleUrls: ['security-group-page.component.scss'],
  providers: [ListService],
})
export class SecurityGroupPageComponent {
  @Input()
  public securityGroups: SecurityGroup[];
  @Input()
  public isLoading = false;
  @Input()
  public viewMode: SecurityGroupViewMode;
  @Input()
  public query: string;
  @Input()
  public vmList: NgrxEntities<VirtualMachine>;

  public mode: ViewMode;
  public viewModeKey = 'sgPageViewMode';

  public get isCreationEnabled(): boolean {
    return this.viewMode !== SecurityGroupViewMode.Private;
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public listService: ListService,
  ) {}

  public get showSidebarDetails(): boolean {
    return this.activatedRoute.snapshot.firstChild.firstChild.routeConfig.path === 'details';
  }

  public changeMode(mode) {
    this.mode = mode;
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute,
    });
  }
}
