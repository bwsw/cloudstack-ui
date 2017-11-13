import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { ActivatedRoute } from '@angular/router';

import * as fromOsTypes from '../../redux/ostype.reducers';
import * as fromTemplates from '../../redux/template.reducers';
import * as templateActions from '../../redux/template.actions';

@Component({
  selector: 'cs-template-sidebar-container',
  template: `
    <cs-template-sidebar
      [entity]="template$ | async"
    ></cs-template-sidebar>`
})
export class TemplateSidebarContainerComponent implements OnInit, AfterViewInit {
  public osTypes$ = this.store.select(fromOsTypes.selectAll);
  public template$ = this.store.select(fromTemplates.getSelectedTemplate);

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
  }

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new templateActions.LoadSelectedTemplate(params['id']));
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
