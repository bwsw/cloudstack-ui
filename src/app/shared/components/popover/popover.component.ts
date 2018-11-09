import { Component, TemplateRef, ViewChild } from '@angular/core';

/**
 * This component is used in conjunction with csPopoverTrigger directive:
 *    <button [csPopoverTrigger]="popover"></button>
 *    <cs-popover #popover></cs-popover>
 *
 * It serves as the popover content.
 */
@Component({
  selector: 'cs-popover',
  templateUrl: './popover.component.html',
})
export class PopoverComponent {
  @ViewChild(TemplateRef)
  templateRef: TemplateRef<any>;
}
