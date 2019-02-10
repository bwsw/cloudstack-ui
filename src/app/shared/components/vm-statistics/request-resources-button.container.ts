import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RequestResourcesContainerComponent } from '../../../resource-quotas/containers/request-resources.container';
import { Constants } from '../../constants';
import { MatDialog } from '@angular/material';
import { select, Store } from '@ngrx/store';
import * as configSelectors from '../../../root-store/config/config.selectors';
import { map } from 'rxjs/operators';
import { State } from '../../../reducers';

// todo: move to request resources module

@Component({
  selector: 'cs-request-resources-button-container',
  template: `
    <cs-request-resources-button
      [isAdmin]="isAdmin"
      [isResourceLimitsEnabled]="isResourceLimitsEnabled$ | async"
      (requestResources)="onRequestResources()"
    ></cs-request-resources-button>
  `,
})
export class RequestResourcesButtonContainerComponent {
  readonly isResourceLimitsEnabled$ = this.store.pipe(
    select(configSelectors.get('extensions')),
    map(({ resourceLimits }) => !!resourceLimits),
  );

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private dialogService: MatDialog,
  ) {}

  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public onRequestResources() {
    this.dialogService.open(RequestResourcesContainerComponent, {
      width: Constants.dialogSizes.dialogSize650,
    });
  }
}
