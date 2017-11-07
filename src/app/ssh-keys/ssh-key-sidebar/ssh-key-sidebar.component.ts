import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { NotificationService } from '../../shared/services/notification.service';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { EntityDoesNotExistError } from '../../shared/components/sidebar/entity-does-not-exist-error';


@Component({
  selector: 'cs-ssh-key-sidebar',
  templateUrl: 'ssh-key-sidebar.component.html'
})
export class SshKeySidebarComponent extends SidebarComponent<SSHKeyPair> implements OnInit {
  public description: string;
  public account: string;

  constructor(protected entityService: SSHKeyPairService,
              protected notificationService: NotificationService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected userTagService: UserTagService) {
    super(entityService, notificationService, route, router);
  }

  public ngOnInit() {
    this.getEntityAccount();

    this.pluckId()
      .switchMap(id => this.loadEntity(id, this.account))
      .subscribe(entity => this.entity = entity);
  }

  public onDescriptionChange(description: string): void {
    this.description = description;
    this.userTagService.setSshKeyDescription(this.entity, this.description).subscribe();
  }

  protected loadEntity(name: string, account?: string): Observable<SSHKeyPair> {
    return this.entityService.getByName(name, account)
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
  }

  private getEntityAccount() {
    this.route.queryParams.subscribe((params: Params) => {
      this.account = params['account'];
    });
  }
}
