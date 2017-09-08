import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateZonesComponent } from './zones.component';
import { IsoService } from '../../shared/iso/iso.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Iso } from '../../shared/iso/iso.model';


@Component({
  selector: 'cs-template-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class IsoZonesComponent extends BaseTemplateZonesComponent<Iso> {
  constructor(
    service: IsoService,
    route: ActivatedRoute,
    dialogService: DialogService
  ) {
    super(service, route, dialogService);
  }
}
