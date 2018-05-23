import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { CustomServiceOfferingComponent } from './custom-service-offering/custom-service-offering.component';
import { ServiceOfferingDialogComponent } from './service-offering-dialog/service-offering-dialog.component';
import { ServiceOfferingFilterComponent } from './service-offering-filter/service-offering-filter.component';
import { ServiceOfferingListComponent } from './service-offering-list/service-offering-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDialogModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    SharedModule,
    MatSelectModule,
    MatDialogModule,
    TranslateModule,
  ],
  exports: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent
  ],
  declarations: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent,
    ServiceOfferingFilterComponent,
    ServiceOfferingListComponent
  ],
  entryComponents: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent
  ]
})
export class ServiceOfferingModule {
}
