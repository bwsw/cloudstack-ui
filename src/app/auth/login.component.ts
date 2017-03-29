import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  INotificationService,
  SecurityGroupService,
  VolumeService
} from '../shared';
import { AffinityGroupService } from '../shared/services/affinity-group.service';


@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent {
  public username: string;
  public password: string;

  constructor(
    private auth: AuthService,
    private affinityGroupService: AffinityGroupService,
    @Inject('INotificationService') private notification: INotificationService,
    private router: Router,
    private securityGroupService: SecurityGroupService,
    private volumeService: VolumeService
  ) {
    this.username = '';
    this.password = '';
  }

  public onSubmit(): void {
    this.login(this.username, this.password);
  }

  private login(username: string, password: string): void {
    this.auth.login(username, password)
      .subscribe(() => {
        this.handleLogin();
      }, error => {
        this.handleError(error);
      });
  }

  private handleLogin(): void {
    this.securityGroupService.removeEmptyGroups();
    this.affinityGroupService.removeEmptyGroups();
    this.volumeService.removeMarkedVolumes();
    this.router.navigate(['']);
  }

  private handleError(error: string): void {
    this.notification.message(error);
  }
}
