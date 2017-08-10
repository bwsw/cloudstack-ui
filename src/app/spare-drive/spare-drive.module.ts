import { MdlModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdSelectModule, MdTooltipModule, MdMenuModule, MdButtonModule, MdIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';

import { SharedModule } from '../shared/shared.module';
import { SpareDriveActionsService } from './spare-drive-actions.service';
import { SpareDriveAttachmentComponent } from './spare-drive-attachment/spare-drive-attachment.component';
import { SpareDriveCreationComponent } from './spare-drive-creation/spare-drive-creation.component';
import { SpareDriveItemComponent } from './spare-drive-item/spare-drive-item.component';
import { SpareDriveListComponent } from './spare-drive-list/spare-drive-list.component';
import { SpareDrivePageComponent } from './spare-drive-page/spare-drive-page.component';
import { SpareDriveSidebarComponent } from './spare-drive-sidebar/spare-drive-sidebar.component';
import { spareDrivesRouting } from './spare-drive.routing';
import { SpareDriveAttachAction } from './spare-drive-actions/spare-drive-attach';
import { SpareDriveResizeAction } from './spare-drive-actions/spare-drive-resize';
import { SpareDriveRemoveAction } from './spare-drive-actions/spare-drive-remove';
import { SpareDriveAction } from './spare-drive-actions/spare-drive-action';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdSelectModule,
    MdTooltipModule,
    MdlModule,
    SharedModule,
    spareDrivesRouting,
    DynamicModule.withComponents([SpareDriveItemComponent]),
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
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
    SpareDriveActionsService,
    SpareDriveAttachAction,
    SpareDriveResizeAction,
    SpareDriveRemoveAction
  ]
})
export class SpareDriveModule { }
