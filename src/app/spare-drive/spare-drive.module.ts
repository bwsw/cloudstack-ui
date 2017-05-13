import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from 'angular2-mdl';

import { SharedModule } from '../shared/shared.module';
import { SpareDriveAttachmentComponent } from './spare-drive-attachment/spare-drive-attachment.component';
import { SpareDriveCreationComponent } from './spare-drive-creation/spare-drive-creation.component';
import { SpareDriveItemComponent } from './spare-drive-item/spare-drive-item.component';
import { SpareDriveListComponent } from './spare-drive-list/spare-drive-list.component';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';
import { spareDrivesRouting } from './spare-drive.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SharedModule,
    spareDrivesRouting
  ],
  declarations: [
    SpareDrivePageComponent,
    SpareDriveSidebarComponent,
    SpareDriveAttachmentComponent,
    SpareDriveCreationComponent,
    SpareDriveItemComponent,
    SpareDriveListComponent
  ],
  exports: [
    SpareDrivePageComponent
  ],
  entryComponents: [
    SpareDriveAttachmentComponent,
    SpareDriveCreationComponent
  ]
})
export class SpareDriveModule { }
