import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { SnapshotCreationComponent } from './snapshot-creation.component';
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
  exports: [
    SnapshotCreationComponent
  ],
  declarations: [
    SnapshotCreationComponent
  ],
  entryComponents: [
    SnapshotCreationComponent
  ]
})
export class SnapshotModule { }
