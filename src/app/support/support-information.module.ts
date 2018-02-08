import { SupportInformationComponent } from './support-information.component';
import { NgModule } from '@angular/core';
import { MatExpansionModule, MatIconModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    MatExpansionModule
  ],
  declarations: [
    SupportInformationComponent
  ]
})
export class SupportInformationModule {

}
