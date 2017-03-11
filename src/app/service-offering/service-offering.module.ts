import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { ServiceOfferingDialogComponent } from './service-offering-dialog.component';
import { ServiceOfferingSelectorComponent } from './service-offering-selector.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    MdlModule,
    MdlSelectModule
  ],
  exports: [
    ServiceOfferingDialogComponent,
    ServiceOfferingSelectorComponent
  ],
  declarations: [
    ServiceOfferingDialogComponent,
    ServiceOfferingSelectorComponent
  ],
  entryComponents: [
    ServiceOfferingDialogComponent,
    ServiceOfferingSelectorComponent
  ]
})
export class ServiceOfferingModule { }
