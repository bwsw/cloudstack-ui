import { Component, Input } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-actions-sidebar',
  templateUrl: 'volume-actions-sidebar.component.html',
  styleUrls: ['volume-actions-sidebar.component.scss'],
})
export class VolumeActionsSidebarComponent {
  @Input()
  public volume: Volume;
}
