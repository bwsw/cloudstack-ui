import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdCommonModule, MdOptionModule } from '@angular/material';
import { DragulaModule } from 'ng2-dragula';
import { DraggableSelectComponent } from './draggable-select.component';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    MdOptionModule,
    OverlayModule,
    MdCommonModule,
  ],
  exports: [DraggableSelectComponent],
  declarations: [DraggableSelectComponent]
})
export class DraggableSelectModule { }
