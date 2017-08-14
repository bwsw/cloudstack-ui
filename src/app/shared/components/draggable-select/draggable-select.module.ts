import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdCommonModule, MdOptionModule, OverlayModule } from '@angular/material';
import { DragulaModule } from 'ng2-dragula';
import { DraggableSelectComponent } from './draggable-select.component';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    OverlayModule,
    MdOptionModule,
    MdCommonModule,
  ],
  exports: [DraggableSelectComponent],
  declarations: [DraggableSelectComponent]
})
export class DraggableSelectModule { }
