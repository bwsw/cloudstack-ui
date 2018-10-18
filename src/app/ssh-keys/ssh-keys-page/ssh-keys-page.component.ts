import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../shared/components/list/list.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { Account } from '../../shared/models/account.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { AuthService } from '../../shared/services/auth.service';
import { Grouping } from '../../shared/models/grouping.model';

@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html',
  styleUrls: ['ssh-keys-page.component.scss'],
  providers: [ListService],
})
export class SshKeysPageComponent {
  @Input()
  public isLoading = false;
  @Input()
  public sshKeyList: SSHKeyPair[];
  @Input()
  public groupings: Grouping[];
  @Input()
  public accounts: Account[];
  @Input()
  public selectedAccountIds = [];
  @Input()
  public selectedGroupings: Grouping[] = [];
  @Output()
  public keyRemoved = new EventEmitter<SSHKeyPair>();
  @Output()
  public accountsChanged = new EventEmitter<Account[]>();
  @Output()
  public groupingsChanged = new EventEmitter();

  public mode: ViewMode;
  public viewModeKey = 'sshKeyPageViewMode';

  constructor(
    public listService: ListService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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

  public removeKey(sshKeyPair: SSHKeyPair): void {
    this.keyRemoved.emit(sshKeyPair);
  }
}
