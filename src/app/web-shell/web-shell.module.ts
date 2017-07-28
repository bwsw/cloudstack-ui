import { MdlModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { WebShellComponent } from './web-shell.component';
import { WebShellService } from './web-shell.service';
import { MdTooltipModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MdlModule,
    MdTooltipModule,
    SharedModule,
  ],
  declarations: [
    WebShellComponent
  ],
  exports: [
    WebShellComponent
  ],
  providers: [
    WebShellService
  ]
})
export class WebShellModule { }
