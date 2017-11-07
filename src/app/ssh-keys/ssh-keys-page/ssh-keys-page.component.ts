import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ListService } from '../../shared/components/list/list.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Account } from '../../shared/models/account.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html',
  styleUrls: ['ssh-keys-page.component.scss'],
  providers: [ListService]
})
export class SshKeysPageComponent {
  @HostBinding('class.detail-list-container') public detailListContainer = true;
  @Input() public sshKeyList: Array<SSHKeyPair>;
  @Input() public groupings;
  @Input() public accounts: Array<Account>;
  @Input() public selectedAccountIds = [];
  @Input() public selectedGroupings = [];
  @Output() public onKeyRemove = new EventEmitter<SSHKeyPair>();
  @Output() public onAccountsChange = new EventEmitter<Account[]>();
  @Output() public onGroupingsChange = new EventEmitter();

  public mode: ViewMode;
  public viewModeKey = 'sshKeyPageViewMode';

  constructor(
    public listService: ListService,
    private dialogService: DialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
  }

  public isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  public changeMode(mode) {
    this.mode = mode;
  }

  public removeKey(sshKeyPair: SSHKeyPair): void {
    this.showRemovalDialog(sshKeyPair);
  }

  private showRemovalDialog(sshKeyPair: SSHKeyPair): void {
    this.dialogService.confirm({ message: 'SSH_KEYS.REMOVE_THIS_KEY' })
      .onErrorResumeNext()
      .subscribe((res) => {
        if (res) {
          this.onKeyRemove.emit(sshKeyPair);
        } else {
          return Observable.throw(null);
        }
      }, (error) => {
        if (!error) {
          return;
        }
        this.dialogService.alert({ message: 'SSH_KEYS.KEY_REMOVAL_FAILED' });
      });
  }
}
