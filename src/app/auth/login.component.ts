import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ConfigService } from '../shared/services/config.service';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('user') public usernameField;
  @ViewChild('pass') public passwordField;

  public username = '';
  public password = '';
  public domain = '';
  public loading = true;

  public showDomain = false;

  constructor(
    private auth: AuthService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService
  ) {}

  public ngOnInit(): void {
    const domainFromConfig = this.configService.get('defaultDomain');
    const domainFromQueryParams = this.route.snapshot.queryParams['domain'];
    this.domain = domainFromQueryParams || domainFromConfig || '';
    this.loading = false;
  }

  public toggleDomain(): void {
    this.showDomain = !this.showDomain;
  }

  public onSubmit(): void {
    if (this.username && this.password) {
      this.login(this.username, this.password, this.domain);
      return;
    }
    if (!this.username) {
      this.setErrors(this.usernameField.control);
    }
    if (!this.password) {
      this.setErrors(this.passwordField.control);
    }
  }

  private setErrors(control: AbstractControl): void {
    control.setErrors({ required: true });
    control.markAsDirty();
  }

  private login(username: string, password: string, domain: string): void {
    this.auth
      .login(username, password, domain)
      .subscribe(() => this.handleLogin(), error => this.handleError(error));
  }

  private handleLogin(): void {
    const { queryParams } = this.route.snapshot;

    const next =
      queryParams['next'] &&
      queryParams['next'] !== '/login' &&
      queryParams['next'] !== 'login'
        ? queryParams['next']
        : '';

    this.router.navigateByUrl(next);
  }

  private handleError(error: any): void {
    this.notification.message({
      translationToken: error.message,
      interpolateParams: error.params
    });
  }
}
