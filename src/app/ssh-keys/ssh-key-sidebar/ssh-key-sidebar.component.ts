import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { NotificationService } from '../../shared/services/notification.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { EntityDoesNotExistError } from '../../shared/components/sidebar/entity-does-not-exist-error';
import { State } from '../../reducers/index';

import * as sshKeyActions from '../../reducers/ssh-keys/redux/ssh-key.actions';

@Component({
  selector: 'cs-ssh-key-sidebar',
  templateUrl: 'ssh-key-sidebar.component.html'
})
export class SshKeySidebarComponent extends SidebarComponent<SSHKeyPair> {
  public description: string;

  constructor(
    protected entityService: SSHKeyPairService,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected userTagService: UserTagService,
    protected store: Store<State>
  ) {
    super(entityService, notificationService, route, router);
  }

  public onDescriptionChange(description: string): void {
    this.description = description;
    this.userTagService.setSshKeyDescription(this.entity, this.description).subscribe();
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
              this.userTagService.getSshKeyDescription(sshKeyPair)
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
