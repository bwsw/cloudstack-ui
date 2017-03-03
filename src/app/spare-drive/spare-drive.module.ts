import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { SharedModule } from '../shared/shared.module';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { VolumeListComponent } from './volume-list/volume-list.component';
import { VolumeItemComponent } from './volume-item/volume-item.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';
import { VolumeCreationComponent } from './volume-creation/volume-creation.component';
import { VolumeAttachmentComponent } from './volume-attachment/volume-attachment.component';


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
    SpareDrivePageComponent,
    SpareDriveSidebarComponent,
    VolumeAttachmentComponent,
    VolumeCreationComponent,
    VolumeItemComponent,
    VolumeListComponent
  ],
  exports: [
    SpareDrivePageComponent
  ],
  entryComponents: [
    VolumeAttachmentComponent,
    VolumeCreationComponent
  ]
})
export class SpareDriveModule { }
