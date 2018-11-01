import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { SidebarContainerService } from '../../services/sidebar-container.service';

@Component({
  selector: 'cs-fab',
  templateUrl: 'fab.component.html',
  styleUrls: ['fab.component.scss'],
})
export class FabComponent {
  @Input()
  @HostBinding('class.open')
  public isOpen: boolean;
  @Output()
  public clicked = new EventEmitter<Event>();

  constructor(private sidebarContainerService: SidebarContainerService) {}

  public get marginRight() {
    return this.sidebarContainerService.isOpen.getValue()
      ? this.sidebarContainerService.width.getValue()
      : 0;
  }

  public onClick(e: Event): void {
    e.stopPropagation();
    this.clicked.emit(e);
  }
}
