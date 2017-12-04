import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { BaseTemplateModel } from '../shared/base-template.model';

import * as fromTemplates from '../../reducers/templates/redux/template.reducers';
import * as fromTemplateGroups from '../../reducers/templates/redux/template-group.reducers';
import * as templateActions from '../../reducers/templates/redux/template.actions';
import * as osTypeActions from '../../reducers/templates/redux/ostype.actions';

@Component({
  selector: 'cs-template-filter-list-selector-container',
  template: `
    <cs-template-filter-list-selector
      [templates]="templates$ | async"
      [dialogMode]="dialogMode"
      [showIsoSwitch]="showIsoSwitch"
      [selectedTypes]="selectedTypes$ | async"
      [selectedOsFamilies]="selectedOsFamilies$ | async"
      [selectedGroups]="selectedGroups$ | async"
      [viewMode]="viewMode$ | async"
      [query]="query$ | async"
      [groups]="groups$ | async"
      [fetching]="isLoading$ | async"
      [(selectedTemplate)]="selectedTemplate"
      (selectedTemplateChange)="selectedTemplateChange.emit($event)"
      (viewModeChange)="onViewModeChange($event)"
      (onSelectedTypesChange)="onSelectedTypesChange($event)"
      (onSelectedOsFamiliesChange)="onSelectedOsFamiliesChange($event)"
      (onSelectedGroupsChange)="onSelectedGroupsChange($event)"
      (onQueryChange)="onQueryChange($event)"
    ></cs-template-filter-list-selector>`
})
export class TemplateFilterListSelectorContainerComponent implements OnInit, AfterViewInit {
  readonly templates$ = this.store.select(fromTemplates.selectTemplatesForVmCreation);
  readonly isLoading$ = this.store.select(fromTemplates.isLoading);
  readonly groups$ = this.store.select(fromTemplateGroups.selectAll);
  readonly viewMode$ = this.store.select(fromTemplates.vmCreationListViewMode);
  readonly selectedTypes$ = this.store.select(fromTemplates.vmCreationListSelectedTypes);
  readonly selectedOsFamilies$ = this.store.select(fromTemplates.vmCreationListSelectedOsFamilies);
  readonly selectedGroups$ = this.store.select(fromTemplates.vmCreationListSelectedGroups);
  readonly query$ = this.store.select(fromTemplates.vmCreationListQuery);

  @Input() public dialogMode = true;
  @Input() public showIsoSwitch = true;
  @Input() public selectedTemplate: BaseTemplateModel;

  @Output() public selectedTemplateChange = new EventEmitter<BaseTemplateModel>();

  public groupings = [
    {
      key: 'zones',
      label: 'GROUP_BY_ZONES',
      selector: (item: BaseTemplateModel) => item.zoneId || '',
      name: (item: BaseTemplateModel) => item.zoneName || 'NO_ZONE'
    }
  ];

  @Input()
  public set viewMode(value: string) {
    this.onViewModeChange(value);
  }

  @Input()
  public set zoneId(value: string) {
    this.store.dispatch(new templateActions.DialogLoadTemplatesRequest(value));
  }

  constructor(
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) {
  }

  public ngOnInit() {
    this.store.dispatch(new osTypeActions.LoadOsTypesRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onViewModeChange(selectedViewMode: string) {
    this.store.dispatch(new templateActions.DialogTemplatesFilterUpdate({ selectedViewMode }));
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
