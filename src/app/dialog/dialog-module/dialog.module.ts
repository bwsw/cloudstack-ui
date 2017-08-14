import { MdlButtonModule, MdlDialogOutletModule } from '@angular-mdl/core';
import { MdlCommonsModule } from '@angular-mdl/core/components/common';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CustomSimpleDialogComponent } from './custom-dialog.component';
import { DialogService } from './dialog.service';
import { MdlAlertComponent } from './mdl-alert.component';
import { MdlDialogHostComponent } from './mdl-dialog-host.component';
import { MdlDialogComponent } from './mdl-dialog.component';
import { MdlDialogService } from './mdl-dialog.service';
import { MdlSimpleDialogComponent } from './mdl-simple-dialog.component';


const PUBLIC_COMPONENTS = [
  MdlDialogComponent,
  MdlAlertComponent
];

const PRIVATE_COMPONENTS = [
  CustomSimpleDialogComponent,
  MdlDialogHostComponent,
  MdlSimpleDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MdlCommonsModule,
    MdlButtonModule,
    MdlDialogOutletModule.forRoot()
  ],
  exports: [
    ...PUBLIC_COMPONENTS
  ],
  declarations: [
    ...PUBLIC_COMPONENTS,
    ...PRIVATE_COMPONENTS
  ],
  entryComponents: [
    ...PUBLIC_COMPONENTS,
    ...PRIVATE_COMPONENTS
  ],
  providers: [
    DialogService,
    MdlDialogService
  ]
})
export class MdlDialogModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdlDialogModule,
      providers: [DialogService]
    };
  }
}
