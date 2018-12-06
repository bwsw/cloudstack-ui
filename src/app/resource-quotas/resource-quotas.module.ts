import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ResourceQuotasComponent } from './components/resource-quotas/resource-quotas.component';
import { RequestResourcesComponent } from './components/request-resources/request-resources.component';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule],
  declarations: [ResourceQuotasComponent, RequestResourcesComponent],
  entryComponents: [RequestResourcesComponent],
})
export class ResourceQuotasModule {}
