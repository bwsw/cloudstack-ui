import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { PopoverTriggerDirective } from './popover-trigger.directive';

import { PopoverComponent } from './popover.component';

@NgModule({
  imports: [OverlayModule, PortalModule, ScrollDispatchModule],
  exports: [PopoverComponent, PopoverTriggerDirective, ScrollDispatchModule],
  declarations: [PopoverComponent, PopoverTriggerDirective],
  providers: [],
})
export class PopoverModule {}
