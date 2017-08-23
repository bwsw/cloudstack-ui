import {
  Component,
  HostBinding,
  Input,
} from '@angular/core';


@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar-container.component.html',
  styleUrls: ['sidebar-container.component.scss']
})
export class SidebarContainerComponent {
  @Input() @HostBinding('class.open') private isOpen;
}
