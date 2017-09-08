import { Component, Input } from '@angular/core';
import { Iso } from '../../../shared/iso/iso.model';


@Component({
  selector: 'cs-iso-general-information',
  templateUrl: 'iso-general-information.component.html'
})
export class IsoGeneralInformationComponent {
  @Input() public entity: Iso;
}
