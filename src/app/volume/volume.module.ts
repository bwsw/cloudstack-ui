import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { SharedModule } from '../shared/shared.module';
import { VolumeComponent } from './volume.component';
import { SnapshotComponent } from './snapshot/snapshot.component';
import { SnapshotCreationComponent } from './snapshot-creation/snapshot-creation.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule,
    SharedModule
  ],
  exports: [
    VolumeComponent
  ],
  declarations: [
    SnapshotComponent,
    SnapshotCreationComponent,
    VolumeComponent
  ],
  entryComponents: [
    SnapshotCreationComponent
  ]
})
export class VolumeModule { }
