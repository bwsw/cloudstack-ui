import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { VmCreateComponent } from './vm-create.component';
import { VmListComponent } from './vm-list.component';
import { VmListItemComponent } from './vm-list-item.component';
import { VmDetailComponent } from './vm-detail.component';
import { VmStatisticsComponent } from './vm-statistics.component';
import { VmService } from './vm.service';
import { VmCreationTemplateComponent } from './vm-creation-template/vm-creation-template.component';
import { VmCreationTemplateDialogComponent } from './vm-creation-template/vm-creation-template-dialog.component';
import {
  VmCreationTemplateDialogListElementComponent
} from './vm-creation-template/vm-creation-template-dialog-list-element.component';
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
    VmCreateComponent,
    VmListItemComponent,
    VmDetailComponent,
    VmStatisticsComponent,
    VmCreationTemplateComponent,
    VmCreationTemplateDialogComponent,
    VmCreationTemplateDialogListElementComponent,
  ],
  providers: [ VmService ],
  entryComponents: [
    VmCreationTemplateDialogComponent,
    VmCreationTemplateDialogListElementComponent
  ]
})
export class VmModule { }
