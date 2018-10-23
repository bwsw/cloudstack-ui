import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { ActivatedRoute } from '@angular/router';

import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-template-sidebar-container',
  template: `
    <cs-template-sidebar
      [entity]="template$ | async"
    ></cs-template-sidebar>`,
})
export class BaseTemplateSidebarContainerComponent implements OnInit {
  public template$ = this.store.pipe(select(fromTemplates.getSelectedTemplate));

  constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {}

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new templateActions.LoadSelectedTemplate(params['id']));
  }
}
