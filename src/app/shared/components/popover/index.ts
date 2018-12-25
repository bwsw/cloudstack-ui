import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { PopoverTriggerDirective } from './popover-trigger.directive';

import { PopoverComponent } from './popover.component';

@NgModule({
  imports: [OverlayModule, PortalModule, ScrollingModule],
  exports: [PopoverComponent, PopoverTriggerDirective, ScrollingModule],
  declarations: [PopoverComponent, PopoverTriggerDirective],
  providers: [],
})
export class PopoverModule {}
