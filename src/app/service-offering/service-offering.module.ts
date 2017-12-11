import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { CustomServiceOfferingComponent } from './custom-service-offering/custom-service-offering.component';
import { CustomServiceOfferingService } from './custom-service-offering/service/custom-service-offering.service';
import { ServiceOfferingDialogComponent } from './service-offering-dialog/service-offering-dialog.component';
import { ServiceOfferingSelectorComponent } from './service-offering-selector/service-offering-selector.component';
// tslint:disable-next-line
import { ServiceOfferingSelectorContainerComponent } from './service-offering-selector/containers/service-offering-selector.container';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatButtonModule,
    MatDialogModule,
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
    ServiceOfferingSelectorContainerComponent,
    ServiceOfferingSelectorComponent
  ],
  declarations: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent,
    ServiceOfferingSelectorContainerComponent,
    ServiceOfferingSelectorComponent
  ],
  entryComponents: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent,
    ServiceOfferingSelectorComponent,
    ServiceOfferingSelectorContainerComponent
  ],
  providers: [
    CustomServiceOfferingService
  ]
})
export class ServiceOfferingModule {
}
