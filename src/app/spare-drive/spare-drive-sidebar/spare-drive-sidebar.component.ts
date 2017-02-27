import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html'
})
export class SpareDriveSidebarComponent {
  @Input() public isOpen: boolean;
  @Input() public volume: Volume;
  @Output() public onClickOutside = new EventEmitter();
  @HostBinding('class.grid') public grid = true;
}
