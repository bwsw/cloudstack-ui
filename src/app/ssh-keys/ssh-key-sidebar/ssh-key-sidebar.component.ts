import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { SSHKeyPair } from '../../shared/models';
import { SnackBarService } from '../../core/services';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { EntityDoesNotExistError } from '../../shared/components/sidebar/entity-does-not-exist-error';
import { State } from '../../reducers';
import { AccountTagService } from '../../shared/services/tags/account-tag.service';

import * as sshKeyActions from '../../reducers/ssh-keys/redux/ssh-key.actions';

@Component({
  selector: 'cs-ssh-key-sidebar',
  templateUrl: 'ssh-key-sidebar.component.html',
})
export class SshKeySidebarComponent extends SidebarComponent<SSHKeyPair> {
  public description: string;

  constructor(
    protected entityService: SSHKeyPairService,
    protected notificationService: SnackBarService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected store: Store<State>,
    protected accountTagService: AccountTagService,
  ) {
    super(entityService, notificationService, route, router);
  }

  public onDescriptionChange(description: string): void {
    this.description = description;
    this.accountTagService.setSshKeyDescription(this.entity, this.description).subscribe();
  }

  public onRemoveClicked(sshKeyPair) {
    this.store.dispatch(new sshKeyActions.RemoveSshKeyPair(sshKeyPair));
  }

  protected loadEntity(name: string): Observable<SSHKeyPair> {
    return this.route.queryParams.pipe(
      switchMap(value => {
        const params = { name };
        if (value.account) {
          params['account'] = value.account;
        }
        return this.entityService.getByParams(params).pipe(
          switchMap(sshKeyPair => {
            if (sshKeyPair) {
              return of(sshKeyPair);
            }
            return throwError(new EntityDoesNotExistError());
          }),
          switchMap(sshKeyPair => {
            return forkJoin(
              of(sshKeyPair),
              this.accountTagService.getSshKeyDescription(sshKeyPair),
            );
          }),
          map(([sshKeyPair, description]) => {
            this.description = description;
            return sshKeyPair;
          }),
        );
      }),
    );
  }
}
