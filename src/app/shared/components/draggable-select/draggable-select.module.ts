import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatOptionModule } from '@angular/material';
import { DragulaModule } from 'ng2-dragula';
import { DraggableSelectComponent } from './draggable-select.component';

@NgModule({
  imports: [CommonModule, DragulaModule, MatOptionModule, OverlayModule, MatCommonModule],
  exports: [DraggableSelectComponent],
  declarations: [DraggableSelectComponent],
})
export class DraggableSelectModule {}
