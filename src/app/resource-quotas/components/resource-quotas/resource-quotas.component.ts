import { Component, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import * as resourceQuotasActions from '../../redux/resource-quotas.actions';

@Component({
  selector: 'cs-resource-quotas',
  templateUrl: 'resource-quotas.component.html',
  styleUrls: ['resource-quotas.component.scss'],
})
export class ResourceQuotasComponent implements OnInit {
  titles = [
    'RESOURCE_QUOTAS_PAGE.RESOURCES.INSTANCES',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.IPS',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.VOLUMES',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.SNAPSHOTS',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.TEMPLATES',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.PROJECTS',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.NETWORK',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.VPCS',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.CPUS',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.MEMORY',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.PRIMARY_STORAGE',
    'RESOURCE_QUOTAS_PAGE.RESOURCES.SECONDARY_STORAGE',
  ];

  constructor(private store: Store<State>) {}

  public ngOnInit() {
    this.store.dispatch(new resourceQuotasActions.LoadResourceQuotasRequest());
  }
}
