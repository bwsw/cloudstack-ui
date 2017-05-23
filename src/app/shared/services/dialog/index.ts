import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlDialogService } from './mdl-dialog.service';
import { MdlDialogComponent } from './mdl-dialog.component';
import { MdlSimpleDialogComponent } from './mdl-simple-dialog.component';
import { MdlDialogHostComponent } from './mdl-dialog-host.component';
import { MdlAlertComponent } from './mdl-alert.component';
import { DialogService } from './dialog.service';
import { MdlCommonsModule } from '@angular-mdl/core/components/common';
import { MdlButtonModule, MdlDialogOutletModule } from '@angular-mdl/core';

export * from './mdl-dialog.component';
export * from './mdl-dialog.service';
export * from './mdl-dialog-configuration';
export * from './mdl-alert.component';



const PUBLIC_COMPONENTS = [
  MdlDialogComponent,
  MdlAlertComponent
];

const PRIVATE_COMPONENTS = [
  MdlDialogHostComponent,
  MdlSimpleDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
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
  ]
})
export class MdlDialogModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdlDialogModule,
      providers: [MdlDialogService, DialogService]
    };
  }
}
