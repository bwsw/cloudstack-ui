import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html',
  styleUrls: ['spare-drive-sidebar.component.scss']
})
export class SpareDriveSidebarComponent {
  @Input() public isOpen: boolean;
  @Input() public volume: Volume;
  @Output() public onClickOutside = new EventEmitter();
}
