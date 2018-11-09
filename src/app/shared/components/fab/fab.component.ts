import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { SidebarWidthService } from '../../../core/services';

@Component({
  selector: 'cs-fab',
  templateUrl: 'fab.component.html',
  styleUrls: ['fab.component.scss'],
})
export class FabComponent {
  @HostBinding('style.margin-right.px')
  public rightIndent: number;
  @Output()
  public clicked = new EventEmitter<Event>();

  constructor(private sidebarWidthService: SidebarWidthService) {
    this.sidebarWidthService.width.subscribe(width => (this.rightIndent = width));
  }

  public onClick(e: Event): void {
    e.stopPropagation();
    this.clicked.emit(e);
  }
}
