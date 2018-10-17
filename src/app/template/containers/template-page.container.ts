import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

import * as fromTemplates from '../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-template-page-container',
  templateUrl: 'template-page.container.html',
})
export class TemplatePageContainerComponent extends WithUnsubscribe()
  implements OnInit, AfterViewInit {
  readonly templates$ = this.store.pipe(select(fromTemplates.selectFilteredTemplates));
  readonly isLoading$ = this.store.pipe(select(fromTemplates.isLoading));
  readonly query$ = this.store.pipe(select(fromTemplates.filterQuery));
  readonly selectedGroupings$ = this.store.pipe(select(fromTemplates.filterSelectedGroupings));

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onTemplateDelete(template) {
    this.store.dispatch(new templateActions.RemoveTemplate(template));
  }
}
