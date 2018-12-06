import { Component } from '@angular/core';

@Component({
  selector: 'cs-request-resources',
  templateUrl: 'request-resources.component.html',
  styleUrls: ['request-resources.component.scss'],
})
export class RequestResourcesComponent {
  titles = [
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.INSTANCES', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.IPS', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.VOLUMES', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.SNAPSHOTS', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.TEMPLATES', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.PROJECTS', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.NETWORK', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.VPCS', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.CPUS', value: Math.floor(Math.random() * 100) },
    { title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.MEMORY', value: Math.floor(Math.random() * 100) },
    {
      title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.PRIMARY_STORAGE',
      value: Math.floor(Math.random() * 100),
    },
    {
      title: 'RESOURCE_QUOTAS_PAGE.RESOURCES.SECONDARY_STORAGE',
      value: Math.floor(Math.random() * 100),
    },
  ];
}
