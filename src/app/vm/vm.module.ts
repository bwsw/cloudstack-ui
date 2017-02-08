import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { StorageDetailComponent } from './vm-sidebar/storage-detail.component';
import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmDetailComponent } from './vm-sidebar/vm-detail.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { VmListItemComponent } from './vm-list/vm-list-item.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VmStatisticsComponent } from './vm-statistics/vm-statistics.component';
import { VmService } from './shared/vm.service';
import { VmTemplateComponent } from './vm-creation/vm-creation-template/vm-template.component';
import { VmTemplateDialogComponent } from './vm-creation/vm-creation-template/vm-template-dialog.component';
import {
  VmTemplateDialogItemComponent
} from './vm-creation/vm-creation-template/vm-template-dialog-item.component';
import { SharedModule } from '../shared/shared.module';
import { VolumeResizeComponent } from './vm-sidebar/volume-resize.component';
import { VolumeSizeControlComponent } from './shared/volume-size-control.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServiceOfferingModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SnapshotModule,
    SharedModule
  ],
  declarations: [
    StorageDetailComponent,
    VmListComponent,
    VmCreationComponent,
    VmListItemComponent,
    VmDetailComponent,
    VmSidebarComponent,
    VmStatisticsComponent,
    VmTemplateComponent,
    VmTemplateDialogComponent,
    VmTemplateDialogItemComponent,
    VolumeResizeComponent,
    VolumeSizeControlComponent
  ],
  providers: [
    VmService
  ],
  entryComponents: [
    VmTemplateDialogComponent,
    VmTemplateDialogItemComponent,
    VolumeResizeComponent
  ]
})
export class VmModule { }
