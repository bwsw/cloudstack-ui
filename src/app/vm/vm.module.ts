import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { VmListItemComponent } from './vm-list/vm-list-item.component';
import { VmDetailComponent } from './vm-list/vm-detail.component';
import { VmStatisticsComponent } from './vm-statistics/vm-statistics.component';
import { VmService } from './vm.service';
import { VmTemplateComponent } from './vm-creation/vm-creation-template/vm-template.component';
import { VmTemplateDialogComponent } from './vm-creation/vm-creation-template/vm-template-dialog.component';
import {
  VmTemplateDialogItemComponent
} from './vm-creation/vm-creation-template/vm-template-dialog-item.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlSelectModule,
    SharedModule
  ],
  declarations: [
    VmListComponent,
    VmCreationComponent,
    VmListItemComponent,
    VmDetailComponent,
    VmStatisticsComponent,
    VmTemplateComponent,
    VmTemplateDialogComponent,
    VmTemplateDialogItemComponent,
  ],
  providers: [ VmService ],
  entryComponents: [
    VmTemplateDialogComponent,
    VmTemplateDialogItemComponent
  ]
})
export class VmModule { }
