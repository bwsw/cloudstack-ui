import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { AuthService } from '../shared/services/auth.service';
import { SnackBarService } from '../core/services/';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { configSelectors, State } from '../root-store';

@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('user')
  public usernameField;
  @ViewChild('pass')
  public passwordField;

  public username = '';
  public password = '';
  public domain = '';
  public loading = true;

  public showDomain = false;
  public key = 'showDomain';

  constructor(
    private auth: AuthService,
    private notification: SnackBarService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: LocalStorageService,
    private store: Store<State>,
  ) {}

  public ngOnInit(): void {
    const value = this.storage.read(this.key);
    this.showDomain = value === 'true';
    const domainFromQueryParams = this.route.snapshot.queryParams['domain'];
    this.store
      .pipe(
        select(configSelectors.get('defaultDomain')),
        first(),
      )
      .subscribe(domainFromConfig => {
        this.domain = domainFromQueryParams || domainFromConfig || '';
      });
    this.loading = false;
  }

  public toggleDomain(): void {
    this.showDomain = !this.showDomain;
    this.storage.write(this.key, this.showDomain.toString());
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
      queryParams['next'] && queryParams['next'] !== '/login' && queryParams['next'] !== 'login'
        ? queryParams['next']
        : '';

    this.router.navigateByUrl(next);
  }

  private handleError(error: any): void {
    this.notification
      .open({
        translationToken: error.message,
        interpolateParams: error.params,
      })
      .subscribe();
  }
}
