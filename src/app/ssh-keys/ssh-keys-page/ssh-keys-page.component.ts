import {
  Component, EventEmitter, HostBinding, Input, OnInit,
  Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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


@Component({
  selector: 'cs-ssh-keys-page',
  templateUrl: 'ssh-keys-page.component.html',
  styleUrls: ['ssh-keys-page.component.scss'],
  providers: [ListService]
})
export class SshKeysPageComponent {
  // @HostBinding('class.detail-list-container') public detailListContainer = true;
  @Input() public sshKeyList: Array<SSHKeyPair>;
  @Input() public selectedGroupings = [];
  @Output() public onKeyRemove = new EventEmitter<SSHKeyPair>();

  constructor(
    public listService: ListService,
    private dialogService: DialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
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

  private showRemovalDialog(sshKeyPair: SSHKeyPair): void {
    this.dialogService.confirm({ message: 'SSH_KEYS.REMOVE_THIS_KEY' })
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          // this.setLoading(sshKeyPair.name);
          this.onKeyRemove.emit(sshKeyPair);
        } else {
          return Observable.throw(null);
        }
      })
      .subscribe(
        () => console.log('qq'),
        (error) => {
          if (!error) {
            return;
          }
          // this.setLoading(name, false);
          this.dialogService.alert({ message: 'SSH_KEYS.KEY_REMOVAL_FAILED' });
        }
      );
  }

  // @Input() public visibleSshKeyList: Array<SSHKeyPair>;
  // public groupingChanged = new EventEmitter<any>();
  //
  // public groupings = [
  //   {
  //     key: 'accounts',
  //     label: 'SSH_KEYS.FILTERS.GROUP_BY_ACCOUNTS',
  //     selector: (item: SSHKeyPair) => item.account,
  //     name: (item: SSHKeyPair) => `${this.getDomain(item.domainid)}${item.account}`
  //       || `${item.domain}/${item.account}`,
  //   }
  // ];
  //
  // public filterData: any;
  // public domainList: Array<Domain>;
  //
  // @Output()
  // public onGroupingChange(groupings: any) {
  //   this.groupingChanged.emit(groupings);
  // }
  //
  //
  // constructor(
  //   public listService: ListService,
  //   private dialogService: DialogService,
  //   private sshKeyService: SSHKeyPairService,
  //   private domainService: DomainService,
  //   private router: Router,
  //   private activatedRoute: ActivatedRoute,
  //   private authService: AuthService
  // ) {
  //   if (!this.authService.isAdmin()) {
  //     this.groupings = this.groupings.filter(g => g.key !== 'accounts');
  //   } else {
  //     this.getDomainList();
  //   }
  // }
  //


  // public updateFilters(filterData: SshKeyFilter): void {
  //   this.filterData = filterData;
  //   this.filter();
  // }
  //
  // public filter(): void {
  //
  //   if (!this.sshKeyList || !this.sshKeyList.length) {
  //     return;
  //   }
  //   this.visibleSshKeyList = this.sshKeyList;
  //   if (!this.filterData) {
  //     return;
  //   }
  //
  //   this.updateGroupings();
  //   const { accounts } = this.filterData;
  //   this.visibleSshKeyList = this.filterByAccount(this.visibleSshKeyList, accounts);
  // }
  //
  // public updateGroupings(): void {
  //   this.selectedGroupings = this.filterData.groupings.reduce((acc, g) => {
  //     acc.push(this.groupings.find(_ => _ === g));
  //     return acc;
  //   }, []);
  // }
  //

  //
  // private getDomainList() {
  //   this.domainService.getList().subscribe(domains => {
  //     this.domainList = domains;
  //   });
  // }
  //
  // private getDomain(domainId: string) {
  //   const domain = this.domainList && this.domainList.find(d => d.id === domainId);
  //   return domain ? domain.getPath() : '';
  // }
  //
  // private filterByAccount(visibleSshKeyList: Array<SSHKeyPair>, accounts = []) {
  //   return !accounts.length
  //     ? visibleSshKeyList
  //     : visibleSshKeyList.filter(key =>
  //       accounts.find(
  //         account => account.name === key.account && account.domainid === key.domainid));
  // }
  //
  // private setLoading(name, value = true): void {
  //   const sshKey: SSHKeyPair = this.sshKeyList.find(key => key.name === name);
  //   if (!sshKey) {
  //     return;
  //   }
  //   sshKey['loading'] = value;
  // }
}
