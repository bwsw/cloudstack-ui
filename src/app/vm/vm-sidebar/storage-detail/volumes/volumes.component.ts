import { Component, Input } from '@angular/core';
import { Volume } from '../../../../shared';

@Component({
  selector: 'cs-volumes',
  templateUrl: 'volumes.component.html',
})
export class VolumesComponent {
  @Input()
  public volumes: Volume[];
}
