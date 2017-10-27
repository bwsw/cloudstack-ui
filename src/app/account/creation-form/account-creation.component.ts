import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { MatDialog } from '@angular/material';
import { AccountCreationContainer } from '../account-container/account-creation.container';

@Component({
  selector: 'cs-account-creation',
  template: ''
})
export class AccountCreationComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dialog.open(AccountCreationContainer, {
      disableClose: true,
      width: '400px',
    })
      .afterClosed()
      .subscribe(() => this.router.navigate(['../'], {
        queryParamsHandling: 'preserve',
        relativeTo: this.route
      }));
  }
}
