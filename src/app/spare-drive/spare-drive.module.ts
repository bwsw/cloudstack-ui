import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from '@angular-mdl/core';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlSelectModule } from '@angular-mdl/select';

import { SharedModule } from '../shared/shared.module';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { SpareDriveListComponent } from './spare-drive-list/spare-drive-list.component';
import { SpareDriveItemComponent } from './spare-drive-item/spare-drive-item.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';
import { SpareDriveCreationComponent } from './spare-drive-creation/spare-drive-creation.component';
import { SpareDriveAttachmentComponent } from './spare-drive-attachment/spare-drive-attachment.component';
import { SpareDriveActionsService } from './spare-drive-actions.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SharedModule
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
  ],
  providers: [
    SpareDriveActionsService
  ]
})
export class SpareDriveModule { }
