import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';
import * as fromSecurityGroups from '../../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-sg-rules-dialog-container',
  template: `
    <cs-sg-rules-dialog [securityGroup]="securityGroup$ | async"></cs-sg-rules-dialog>`
})
export class SecurityGroupRulesDialogContainerComponent implements OnInit {
  readonly securityGroup$ = this.store.select(fromSecurityGroups.getSelectedSecurityGroup);

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public onSecurityGroupChange() {
    this.store.dispatch(new securityGroupActions.LoadSGRequest());
  }

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new securityGroupActions.LoadSelectedSG(params['id']));
  }
}
