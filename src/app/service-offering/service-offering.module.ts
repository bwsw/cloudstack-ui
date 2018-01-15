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
import { DynamicModule } from 'ng-dynamic-component';
import { SharedModule } from '../shared/shared.module';
import { CustomServiceOfferingComponent } from './custom-service-offering/custom-service-offering.component';
import { ServiceOfferingDialogComponent } from './service-offering-dialog/service-offering-dialog.component';
import { ServiceOfferingFilterComponent } from './service-offering-filter/service-offering-filter.component';
import { ServiceOfferingItemComponent } from './service-offering-list/service-offering-item.component';
import { ServiceOfferingListComponent } from './service-offering-list/service-offering-list.component';
import { ServiceOfferingSelectorComponent } from './service-offering-selector/service-offering-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DynamicModule.withComponents([
      ServiceOfferingItemComponent
    ]),
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
    ServiceOfferingDialogComponent,
    ServiceOfferingSelectorComponent
  ],
  declarations: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent,
    ServiceOfferingFilterComponent,
    ServiceOfferingListComponent,
    ServiceOfferingSelectorComponent,
    ServiceOfferingItemComponent
  ],
  entryComponents: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent,
    ServiceOfferingSelectorComponent,
  ]
})
export class ServiceOfferingModule {
}
