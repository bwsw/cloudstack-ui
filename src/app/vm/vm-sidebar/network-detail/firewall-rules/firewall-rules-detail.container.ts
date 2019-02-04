import { Component, Input, OnInit } from '@angular/core';
import { VirtualMachine } from '../../../shared/vm.model';

import * as securityGroupActions from '../../../../reducers/security-groups/redux/sg.actions';
import * as vmActions from '../../../../reducers/vm/redux/vm.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../../root-store';
import { Observable } from 'rxjs/internal/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cs-firewall-rules-detail-container',
  template: `
    <cs-firewall-rules-detail
      [vm]="vm"
      (detachFirewall)="onDetachFirewall($event)"
      (attachFirewall)="onAttachFirewall($event)"
    ></cs-firewall-rules-detail>
  `,
})
export class FirewallRulesDetailContainerComponent implements OnInit {
  @Input()
  public vm: VirtualMachine;
  public securityGroups: string[];

  constructor(private store: Store<State>, private dialogService: DialogService) {}

  public ngOnInit() {
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
  }

  public onDetachFirewall(securityGroupId: string) {
    const securityGroups = this.vm.securitygroup
      .map(sg => sg.id)
      .filter(id => id !== securityGroupId);

    this.askToDetachFirewall()
      .pipe(filter(Boolean))
      .subscribe(() =>
        this.store.dispatch(new vmActions.ChangeSecurityGroup({ securityGroups, vm: this.vm })),
      );
  }

  public onAttachFirewall(securityGroupId: string) {
    const securityGroups = this.vm.securitygroup.map(sg => sg.id);
    securityGroups.push(securityGroupId);

    this.store.dispatch(new vmActions.ChangeSecurityGroup({ securityGroups, vm: this.vm }));
  }

  private askToDetachFirewall(): Observable<any> {
    return this.dialogService.confirm({
      message: 'VM_PAGE.VM_DETAILS.SECURITY_GROUP.ASK_TO_CHANGE_SG',
      confirmText: 'COMMON.OK',
      declineText: 'COMMON.CANCEL',
    });
  }
}
