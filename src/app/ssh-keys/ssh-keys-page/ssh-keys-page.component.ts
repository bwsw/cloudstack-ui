import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as sortBy from 'lodash/sortBy';
import { Observable } from 'rxjs/Observable';
import { ListService } from '../../shared/components/list/list.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { SshKeyFilter } from "../ssh-key-filter/ssh-key-filter.component";
import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/models/user.model";
import { AuthService } from "../../shared/services/auth.service";


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
  public groupings = [];

  public filterData: any;
  public userList: Array<User>;

  constructor(
    public listService: ListService,
    private dialogService: DialogService,
    private sshKeyService: SSHKeyPairService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    if (this.authService.isAdmin()) {
      this.groupings = this.groupings.concat({
        key: 'accounts',
        label: 'SSH_KEY_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
        selector: (item: SSHKeyPair) => item.account,
        name: (item: SSHKeyPair) => this.getUserName(item.account),
      });
    }
  }

  public ngOnInit(): void {
    this.update();
    this.getUserList();
    this.listService.onUpdate.subscribe(() => this.update());
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  public removeKey(name: string): void {
    this.showRemovalDialog(name);
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
    this.visibleSshKeyList = this.sortByAccount(accounts);
  }

  public updateGroupings(): void {
    this.selectedGroupings = this.filterData.groupings.reduce((acc, g) => {
      acc.push(this.groupings.find(_ => _ === g));
      return acc;
    }, []);
  }

  private showRemovalDialog(name: string): void {
    this.dialogService.confirm({ message: 'SSH_KEYS.REMOVE_THIS_KEY'})
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          this.setLoading(name);
          return this.sshKeyService.remove({ name });
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

  private getUserList() {
    this.userService.getList().subscribe(users => {
      this.userList = users;
    });
  }

  private getUserName(account: string) {
    let user = this.userList.find(user => user.account === account);
    return user ? user.name: account;
  }

  private sortByAccount(accounts) {
    let result: Array<SSHKeyPair> = [];
    if (accounts && accounts.length != 0) {
      accounts.forEach(account => {
        result = result.concat(this.visibleSshKeyList.filter(key => key.account === account.name))
      });
      return result;
    } else {
      return this.visibleSshKeyList;
    }
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
