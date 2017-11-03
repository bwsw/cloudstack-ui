import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { BaseTemplateModel } from '../shared/base-template.model';

import * as fromTemplates from '../redux/template.reducers';
import * as templateActions from '../redux/template.actions';
import * as fromOsTypes from '../redux/ostype.reducers';

export const templateGroupings = [
  {
    key: 'zones',
    label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_ZONES',
    selector: (item: BaseTemplateModel) => item.zoneId || '',
    name: (item: BaseTemplateModel) => item.zoneName || 'TEMPLATE_PAGE.FILTERS.NO_ZONE'
  },
  {
    key: 'accounts',
    label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
    selector: (item: BaseTemplateModel) => item.account,
    name: (item: BaseTemplateModel) => this.getGroupName(item),
  }
];

export const getGroupName = (template: BaseTemplateModel) => {
  return template.domain !== 'ROOT'
    ? `${template.domain}/${template.account}`
    : template.account;
};

@Component({
  selector: 'cs-template-page-container',
  templateUrl: 'template-page.container.html'
})
export class TemplatePageContainerComponent extends WithUnsubscribe() implements OnInit, AfterViewInit {
  readonly templates$ = this.store.select(fromTemplates.selectFilteredTemplates);
  readonly isLoading$ = this.store.select(fromTemplates.isLoading);
  readonly filters$ = this.store.select(fromTemplates.filters);

  readonly osTypes$ = this.store.select(fromOsTypes.selectAll);
  readonly query$ = this.store.select(fromTemplates.filterQuery);
  readonly selectedAccountIds$ = this.store.select(fromTemplates.filterSelectedAccountIds);
  readonly selectedOsFamilies$ = this.store.select(fromTemplates.filterSelectedOsFamilies);
  readonly selectedTypes$ = this.store.select(fromTemplates.filterSelectedTypes);
  readonly selectedZones$ = this.store.select(fromTemplates.filterSelectedZones);
  readonly selectedGroupings$ = this.store.select(fromTemplates.filterSelectedGroupings);

  constructor(
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({}));
  }
  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onTemplateDelete(template) {
    this.store.dispatch(new templateActions.RemoveTemplateSuccess(template));
  }
}
