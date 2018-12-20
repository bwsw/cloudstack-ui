import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ResourceQuotasComponent } from './components/resource-quotas/resource-quotas.component';
import { RequestResourcesComponent } from './components/request-resources/request-resources.component';
import { ResourceQuotaService } from './services/resource-quota.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ResourceQuotasEffects } from './redux/resource-quotas.effects';
import { resourceQuotasReducers } from './redux/resource-quotas.reducers';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    StoreModule.forFeature('resourceQuotas', resourceQuotasReducers),
    EffectsModule.forFeature([ResourceQuotasEffects]),
  ],
  declarations: [ResourceQuotasComponent, RequestResourcesComponent],
  providers: [ResourceQuotaService],
  entryComponents: [RequestResourcesComponent],
})
export class ResourceQuotasModule {}
