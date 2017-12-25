import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { State } from '../../reducers/index';

import * as sshKeyActions from '../../reducers/ssh-keys/redux/ssh-key.actions';
import { EntityDoesNotExistError } from '../../shared/components/sidebar/entity-does-not-exist-error';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { NotificationService } from '../../shared/services/notification.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { ConfigService } from '../../shared/services/config.service';
import { AccountTagService } from '../../shared/services/tags/account-tag.service';

@Component({
  selector: 'cs-ssh-key-sidebar',
  templateUrl: 'ssh-key-sidebar.component.html'
})
export class SshKeySidebarComponent extends SidebarComponent<SSHKeyPair> {
  public description: string;

  public get showDescription(): boolean {
    return this.configService.get<boolean>('accountTags');
  }

  constructor(
    protected entityService: SSHKeyPairService,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected store: Store<State>,
    protected configService: ConfigService,
    protected accountTagService: AccountTagService
  ) {
    super(entityService, notificationService, route, router);
  }

  public onDescriptionChange(description: string): void {
    this.description = description;
    this.accountTagService.setSshKeyDescription(this.entity, this.description).subscribe();
  }

  protected loadEntity(name: string): Observable<SSHKeyPair> {
    return this.route.queryParams
      .switchMap(value => {
        const params = { name };
        if (value.account) {
          params['account'] = value.account;
        }
        return this.entityService.getByParams(params)
          .switchMap(sshKeyPair => {
            if (sshKeyPair) {
              return Observable.of(sshKeyPair);
            } else {
              return Observable.throw(new EntityDoesNotExistError());
            }
          })
          .switchMap(sshKeyPair => {
            return Observable.forkJoin(
              Observable.of(sshKeyPair),
              this.accountTagService.getSshKeyDescription(sshKeyPair)
            );
          })
          .map(([sshKeyPair, description]) => {
            this.description = description;
            return sshKeyPair;
          });
      });
  }

  public onRemoveClicked(sshKeyPair) {
    this.store.dispatch(new sshKeyActions.RemoveSshKeyPair(sshKeyPair));
  }
}
