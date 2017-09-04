import { MdlModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdDialogModule,
  MdInputModule,
  MdSelectModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { CustomServiceOfferingComponent } from './custom-service-offering/custom-service-offering.component';
import { CustomServiceOfferingService } from './custom-service-offering/service/custom-service-offering.service';
import { ServiceOfferingDialogComponent } from './service-offering-dialog/service-offering-dialog.component';
import { ServiceOfferingSelectorComponent } from './service-offering-selector/service-offering-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MdButtonModule,
    MdDialogModule,
    MdInputModule,
    MdSelectModule,
    MdlModule,
    SharedModule,
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
    ServiceOfferingSelectorComponent
  ],
  entryComponents: [
    CustomServiceOfferingComponent,
    ServiceOfferingDialogComponent,
    ServiceOfferingSelectorComponent
  ],
  providers: [
    CustomServiceOfferingService
  ]
})
export class ServiceOfferingModule { }
