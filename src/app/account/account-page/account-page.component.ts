import { Component, Input } from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import { Account } from '../../shared';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';

@Component({
  selector: 'cs-account-page',
  templateUrl: 'account-page.component.html',
  styleUrls: ['account-page.component.scss'],
  providers: [ListService],
})
export class AccountPageComponent {
  @Input()
  public accounts: Account[] = [];
  @Input()
  public groupings: any[];
  @Input()
  public isLoading: boolean;
  @Input()
  public selectedGroupings: any[] = [];

  public mode: ViewMode;
  public viewModeKey = 'accountPageViewMode';

  constructor(
    public listService: ListService,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  public isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute,
    });
  }

  public changeMode(mode) {
    this.mode = mode;
  }
}
