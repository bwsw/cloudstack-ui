import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { SecurityGroup } from '../../../security-group/sg.model';

import * as securityGroup from './sg.actions';

@Injectable()
export class SecurityGroupEffects {
  @Effect()
  loadSecurityGroups$: Observable<Action> = this.actions$
    .ofType(securityGroup.LOAD_SG_REQUEST)
    .switchMap((action: securityGroup.LoadSGRequest) => {
      return Observable.forkJoin([
        this.securiryGroupService.getList(),
        Observable.of(this.securiryGroupService.getPredefinedTemplates())
      ])
        .map(([groups, templates]) => new securityGroup
          .LoadSGResponse(groups.concat(templates)))
        .catch(() => Observable.of(new securityGroup.LoadSGResponse([])));
    });

  constructor(
    private actions$: Actions,
    private securiryGroupService: SecurityGroupService
  ) {
  }
}
