import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { SidebarContainerService } from '../../services/sidebar-container.service';


@Component({
  selector: 'cs-fab',
  templateUrl: 'fab.component.html',
  styleUrls: ['fab.component.scss']
})
export class FabComponent {
  @Input() @HostBinding('class.open') public isOpen: boolean;
  @Output() public click = new EventEmitter<Event>();

  constructor(private sidebarContainerService: SidebarContainerService) {
  }

  public get marginRight() {
    return this.isOpen ? this.sidebarContainerService.width.getValue() : 0;
  }

  public onClick(e: Event): void {
    e.stopPropagation();
    this.click.emit(e);
  }
}
