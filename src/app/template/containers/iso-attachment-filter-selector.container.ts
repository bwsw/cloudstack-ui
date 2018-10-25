import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { select, Store } from '@ngrx/store';

import { BaseTemplateModel } from '../shared';
import { configSelectors, State } from '../../root-store';
import * as fromTemplates from '../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-iso-attachment-filter-selector-container',
  template: `
    <cs-template-filter-list-selector
      [templates]="isos$ | async"
      [dialogMode]="true"
      [showIsoSwitch]="false"
      [selectedTypes]="selectedTypes$ | async"
      [selectedOsFamilies]="selectedOsFamilies$ | async"
      [selectedGroups]="selectedGroups$ | async"
      [viewMode]="viewMode$ | async"
      [query]="query$ | async"
      [groups]="groups$ | async"
      [fetching]="isLoading$ | async"
      [(selectedTemplate)]="selectedTemplate"
      (selectedTemplateChange)="selectedTemplateChange.emit($event)"
      (selectedTypesChanged)="onSelectedTypesChange($event)"
      (selectedOsFamiliesChanged)="onSelectedOsFamiliesChange($event)"
      (selectedGroupsChanged)="onSelectedGroupsChange($event)"
      (queryChanged)="onQueryChange($event)"
    ></cs-template-filter-list-selector>`,
})
export class IsoAttachmentFilterSelectorContainerComponent implements AfterViewInit {
  readonly isos$ = this.store.pipe(select(fromTemplates.selectTemplatesForIsoAttachment));
  readonly isLoading$ = this.store.pipe(select(fromTemplates.isLoading));
  readonly groups$ = this.store.pipe(select(configSelectors.get('imageGroups')));
  readonly viewMode$ = this.store.pipe(select(fromTemplates.vmCreationListViewMode));
  readonly selectedTypes$ = this.store.pipe(select(fromTemplates.vmCreationListSelectedTypes));
  readonly selectedOsFamilies$ = this.store.pipe(
    select(fromTemplates.vmCreationListSelectedOsFamilies),
  );
  readonly selectedGroups$ = this.store.pipe(select(fromTemplates.vmCreationListSelectedGroups));
  readonly query$ = this.store.pipe(select(fromTemplates.vmCreationListQuery));

  @Input()
  public selectedTemplate: BaseTemplateModel;
  @Output()
  public selectedTemplateChange = new EventEmitter<BaseTemplateModel>();

  public groupings = [
    {
      key: 'zones',
      label: 'GROUP_BY_ZONES',
      selector: (item: BaseTemplateModel) => item.zoneid || '',
      name: (item: BaseTemplateModel) => item.zonename || 'NO_ZONE',
    },
  ];

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onSelectedTypesChange(selectedTypes: string[]) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ selectedTypes }));
  }

  public onSelectedOsFamiliesChange(selectedOsFamilies: string[]) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ selectedOsFamilies }));
  }

  public onSelectedGroupsChange(selectedGroups: string[]) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ selectedGroups }));
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ query }));
  }
}
