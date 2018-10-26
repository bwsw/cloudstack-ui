import { Component } from '@angular/core';
import { BaseTemplateZonesComponent } from './zones.component';
import { IsoService } from '../../shared/iso.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-iso-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss'],
})
export class IsoZonesComponent extends BaseTemplateZonesComponent {
  constructor(service: IsoService, dialogService: DialogService) {
    super(service, dialogService);
  }
}
