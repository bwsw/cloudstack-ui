import { SupportInformationComponent } from './support-information.component';
import { NgModule } from '@angular/core';
import { MatExpansionModule, MatIconModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    MatExpansionModule,
    HttpModule,
  ],
  declarations: [SupportInformationComponent],
})
export class SupportInformationModule {}
