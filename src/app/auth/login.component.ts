import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { finalize, first } from 'rxjs/operators';

import { AuthService } from '../shared/services/auth.service';
import { SnackBarService } from '../core/services/';
import { State } from '../root-store';
import { getDefaultDomain } from '../root-store/config/config.selectors';

@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('usernameControl') public usernameField: NgControl;
  @ViewChild('passwordControl') public passwordField: NgControl;

  public username = '';
  public password = '';
  public domain = '';
  public ready = false;

  public get loading(): boolean {
    return this._loading;
  }

  private _loading = false;

  constructor(
    private auth: AuthService,
    private notification: SnackBarService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
  ) {}

  public ngOnInit(): void {
    const domainFromQueryParams = this.route.snapshot.queryParams['domain'];
    this.store
      .pipe(
        select(getDefaultDomain),
        first(),
      )
      .subscribe(domainFromConfig => {
        this.domain = domainFromQueryParams || domainFromConfig || '';
      });
    this.ready = true;
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
    this._loading = true;

    this.auth
      .login(username, password, domain)
      .pipe(finalize(() => (this._loading = false)))
      .subscribe(() => this.handleLogin(), error => this.handleError(error));
  }

  private handleLogin(): void {
    const { queryParams } = this.route.snapshot;

    const next =
      queryParams['next'] && queryParams['next'] !== '/login' && queryParams['next'] !== 'login'
        ? queryParams['next']
        : '';
    this.auth.generateKey().subscribe();

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
