import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { BaseTemplateModel } from '../shared/base-template.model';

import * as fromTemplates from '../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../reducers/templates/redux/template.actions';


@Component({
  selector: 'cs-template-page-container',
  templateUrl: 'template-page.container.html'
})
export class TemplatePageContainerComponent extends WithUnsubscribe() implements OnInit, AfterViewInit {
  readonly templates$ = this.store.select(fromTemplates.selectFilteredTemplates);
  readonly isLoading$ = this.store.select(fromTemplates.isLoading);
  readonly filters$ = this.store.select(fromTemplates.filters);

  readonly query$ = this.store.select(fromTemplates.filterQuery);
  readonly selectedGroupings$ = this.store.select(fromTemplates.filterSelectedGroupings);

  constructor(
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) {
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
