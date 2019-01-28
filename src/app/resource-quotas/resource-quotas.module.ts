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
import { ResourceQuotasContainerComponent } from './containers/resource-quotas.container';
import { resourceQuotasReducer } from './redux/resource-quotas.reducer';
import { resourceQuotasAdminFormReducer } from './redux/resource-quotas-admin-form.reducer';
import { resourceQuotasUserFormReducer } from './redux/resource-quotas-user-form.reducer';
import { ResourceQuotasEnabledGuard } from './resource-quotas-enabled-guard.service';
import { RequestResourcesContainerComponent } from './containers/request-resources.container';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    StoreModule.forFeature('resourceQuotas', resourceQuotasReducer),
    StoreModule.forFeature('resourceQuotasAdminForm', resourceQuotasAdminFormReducer),
    StoreModule.forFeature('resourceQuotasUserForm', resourceQuotasUserFormReducer),
    EffectsModule.forFeature([ResourceQuotasEffects]),
  ],
  declarations: [
    ResourceQuotasComponent,
    RequestResourcesComponent,
    ResourceQuotasContainerComponent,
    RequestResourcesContainerComponent,
  ],
  providers: [ResourceQuotaService, ResourceQuotasEnabledGuard],
  entryComponents: [RequestResourcesContainerComponent],
})
export class ResourceQuotasModule {}
