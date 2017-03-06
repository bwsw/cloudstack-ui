import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlAutocompleteModule } from '../autocomplete/mdl-autocomplete.component';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { SharedModule } from '../shared/shared.module';
import { StorageDetailComponent } from './vm-sidebar/storage-detail/storage-detail.component';
import { TemplateModule } from '../template/template.module';
import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmDetailComponent } from './vm-sidebar/vm-detail.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { VmListItemComponent } from './vm-list/vm-list-item.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VmService } from './shared/vm.service';
import { VmTemplateComponent } from './vm-creation/vm-creation-template/vm-template.component';
import { VmTemplateDialogComponent } from './vm-creation/vm-creation-template/vm-template-dialog.component';
import { VolumeResizeComponent } from './vm-sidebar/volume-resize.component';
import { IsoComponent } from './vm-sidebar/storage-detail/iso-attachment.component';
import { VolumeComponent } from './vm-sidebar/storage-detail/volume/volume.component';
import { SnapshotComponent } from './vm-sidebar/storage-detail/volume/snapshot/snapshot.component';
import {
  SnapshotCreationComponent
} from './vm-sidebar/storage-detail/volume/snapshot-creation/snapshot-creation.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServiceOfferingModule,
    MdlAutocompleteModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SharedModule,
    TemplateModule,
    TranslateModule
  ],
  declarations: [
    StorageDetailComponent,
    VmListComponent,
    VmCreationComponent,
    VmListItemComponent,
    VmDetailComponent,
    VmSidebarComponent,
    VmTemplateComponent,
    VmTemplateDialogComponent,
    VolumeResizeComponent,
    IsoComponent,
    VolumeComponent,
    SnapshotComponent,
    SnapshotCreationComponent
  ],
  providers: [
    VmService
  ],
  entryComponents: [
    VmCreationComponent,
    VmTemplateDialogComponent,
    VolumeResizeComponent,
    SnapshotCreationComponent
  ]
})
export class VmModule { }
