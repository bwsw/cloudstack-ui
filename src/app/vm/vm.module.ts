import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from 'angular2-mdl';

import { MdlAutocompleteModule } from '../autocomplete/mdl-autocomplete.component';
import { ServiceOfferingModule } from '../service-offering/service-offering.module';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule } from '../template';
import { VmService } from './shared/vm.service';
import { VmTemplateDialogComponent } from './vm-creation/vm-creation-template/vm-template-dialog.component';
import { VmTemplateComponent } from './vm-creation/vm-creation-template/vm-template.component';
import { VmCreationComponent } from './vm-creation/vm-creation.component';
import { VmFilterComponent } from './vm-filter/vm-filter.component';
import { VmListItemComponent } from './vm-list/vm-list-item.component';
import { VmListSectionComponent } from './vm-list/vm-list-section/vm-list-section.component';
import { VmListSubsectionComponent } from './vm-list/vm-list-subsection/vm-list-subsection.component';
import { VmListComponent } from './vm-list/vm-list.component';
import { IsoComponent } from './vm-sidebar/storage-detail/iso.component';
import { StorageDetailComponent } from './vm-sidebar/storage-detail/storage-detail.component';
import {
  SnapshotCreationComponent
} from './vm-sidebar/storage-detail/volume/snapshot-creation/snapshot-creation.component';
import { SnapshotActionsService } from './vm-sidebar/storage-detail/volume/snapshot/snapshot-actions.service';
import { SnapshotModalComponent } from './vm-sidebar/storage-detail/volume/snapshot/snapshot-modal.component';
import { VolumeComponent } from './vm-sidebar/storage-detail/volume/volume.component';
import { VmDetailComponent } from './vm-sidebar/vm-detail.component';
import { VmSidebarComponent } from './vm-sidebar/vm-sidebar.component';
import { VolumeResizeComponent } from './vm-sidebar/volume-resize.component';
import { vmRouting } from './vm.routing';


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
    TranslateModule,
    vmRouting,
  ],
  declarations: [
    StorageDetailComponent,
    VmListComponent,
    VmCreationComponent,
    VmListItemComponent,
    VmDetailComponent,
    VmFilterComponent,
    VmSidebarComponent,
    VmTemplateComponent,
    VmTemplateDialogComponent,
    VmListSectionComponent,
    VmListSubsectionComponent,
    VolumeResizeComponent,
    IsoComponent,
    VolumeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent
  ],
  providers: [
    VmService,
    SnapshotActionsService
  ],
  entryComponents: [
    VmCreationComponent,
    VmTemplateDialogComponent,
    VolumeResizeComponent,
    SnapshotCreationComponent,
    SnapshotModalComponent
  ]
})
export class VmModule { }
