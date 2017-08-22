import {
  Component,
  HostBinding,
  Input,
} from '@angular/core';


@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent {
  @Input() @HostBinding('class.open') private isOpen;

  constructor() {
    this.isOpen = false;
  }
}
