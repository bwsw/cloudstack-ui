import {
  Component,
  HostBinding,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import * as sortBy from 'lodash/sortBy';
import { Observable } from 'rxjs/Observable';
import { ListService } from '../../shared/components/list/list.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { SshKeyFilter } from '../ssh-key-filter/ssh-key-filter.component';
import { AuthService } from '../../shared/services/auth.service';
import { Domain } from '../../shared/models/domain.model';
import { DomainService } from '../../shared/services/domain.service';
import { AccountService } from '../../shared/services/account.service';
import { Account } from '../../shared/models/account.model';


@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html',
  styleUrls: ['ssh-keys-page.component.scss'],
  providers: [ListService]
})
export class SshKeysPageComponent implements OnInit {
  @HostBinding('class.detail-list-container') public detailListContainer = true;
  public sshKeyList: Array<SSHKeyPair>;
  public visibleSshKeyList: Array<SSHKeyPair>;

  public selectedGroupings = [];
  public groupings = [
    {
      key: 'accounts',
      label: 'SSH_KEYS.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: SSHKeyPair) => item.account,
      name: (item: SSHKeyPair) => `${this.getDomain(item.domainid)}${item.account}` || `${item.domain}/${item.account}`,
    }
  ];

  public filterData: any;
  public domainList: Array<Domain>;
  public accounts: Array<Account>;

  constructor(
    public listService: ListService,
    private dialogService: DialogService,
    private sshKeyService: SSHKeyPairService,
    private domainService: DomainService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    if (!this.authService.isAdmin()) {
      this.groupings = this.groupings.filter(g => g.key !== 'accounts');
    } else {
      this.getAccountList();
    }
  }

  public ngOnInit(): void {
    this.update();
    this.listService.onUpdate.subscribe(() => this.update());
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  public removeKey(sshKeyPair: SSHKeyPair): void {
    this.showRemovalDialog(sshKeyPair);
  }

  public updateFilters(filterData: SshKeyFilter): void {
    this.filterData = filterData;
    this.filter();
  }

  public filter(): void {

    if (!this.sshKeyList || !this.sshKeyList.length) {
      return;
    }
    this.visibleSshKeyList = this.sshKeyList;
    if (!this.filterData) {
      return;
    }

    this.updateGroupings();
    const { accounts } = this.filterData;
    this.visibleSshKeyList = this.filterByAccount(this.visibleSshKeyList, accounts);
  }

  public updateGroupings(): void {
    this.selectedGroupings = this.filterData.groupings.reduce((acc, g) => {
      acc.push(this.groupings.find(_ => _ === g));
      return acc;
    }, []);
  }

  private showRemovalDialog(sshKeyPair: SSHKeyPair): void {
    this.dialogService.confirm({ message: 'SSH_KEYS.REMOVE_THIS_KEY' })
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          this.setLoading(sshKeyPair.name);
          return this.sshKeyService.remove(this.authService.isAdmin()
            ? {
              name: sshKeyPair.name,
              account: sshKeyPair.account,
              domainid: sshKeyPair.domainid
            }
            : { name });
        } else {
          return Observable.throw(null);
        }
      })
      .subscribe(
        () => this.update(),
        (error) => {
          if (!error) {
            return;
          }
          this.setLoading(name, false);
          this.dialogService.alert({ message: 'SSH_KEYS.KEY_REMOVAL_FAILED' });
        }
      );
  }

  private getAccountList() {
    Observable.forkJoin(
      this.accountService.getList(),
      this.domainService.getList()
    )
      .subscribe(([accounts, domains]) => {
        this.accounts = accounts;
        this.accounts.map(account => {
          account.fullDomain = domains.find(domain => domain.id === account.domainid).getPath();
          return account;
        });
        this.domainList = domains;
      });
  }

  private getDomain(domainId: string) {
    const domain = this.domainList && this.domainList.find(d => d.id === domainId);
    return domain ? domain.getPath() : '';
  }

  private filterByAccount(visibleSshKeyList: Array<SSHKeyPair>, accounts = []) {
    return !accounts.length
      ? visibleSshKeyList
      : visibleSshKeyList.filter(key =>
        accounts.find(
          account => account.name === key.account && account.domainid === key.domainid));
  }

  private update() {
    this.sshKeyService.getList()
      .subscribe(keyList => {
        this.sshKeyList = sortBy(keyList, 'name');
        this.visibleSshKeyList = this.sshKeyList;
        this.filter();
      });
  }

  private setLoading(name, value = true): void {
    const sshKey: SSHKeyPair = this.sshKeyList.find(key => key.name === name);
    if (!sshKey) {
      return;
    }
    sshKey['loading'] = value;
  }
}
