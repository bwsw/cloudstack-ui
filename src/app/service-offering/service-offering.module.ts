import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { SharedModule } from '../shared/shared.module';
import { CustomServiceOfferingComponent } from './custom-service-offering/custom-service-offering.component';
import { ServiceOfferingDialogComponent } from './service-offering-dialog/service-offering-dialog.component';
import { ServiceOfferingSelectorComponent } from './service-offering-selector/service-offering-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    SharedModule,
    MdlModule,
    MdlSelectModule
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
  ]
})
export class ServiceOfferingModule { }
