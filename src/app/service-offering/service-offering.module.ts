import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { CustomServiceOfferingComponent } from './custom-service-offering/custom-service-offering.component';
import { ServiceOfferingDialogComponent } from './service-offering-dialog/service-offering-dialog.component';
import { ServiceOfferingFilterComponent } from './service-offering-filter/service-offering-filter.component';
import { ServiceOfferingListComponent } from './service-offering-list/service-offering-list.component';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule],
  exports: [CustomServiceOfferingComponent, ServiceOfferingDialogComponent],
  declarations: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent,
    ServiceOfferingFilterComponent,
    ServiceOfferingListComponent,
  ],
  entryComponents: [CustomServiceOfferingComponent, ServiceOfferingDialogComponent],
})
export class ServiceOfferingModule {}
