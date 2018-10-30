import { Component } from '@angular/core';
import { TemplateService } from '../../shared/template.service';
import { BaseTemplateZonesComponent } from './zones.component';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-template-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss'],
})
export class TemplateZonesComponent extends BaseTemplateZonesComponent {
  constructor(service: TemplateService, dialogService: DialogService) {
    super(service, dialogService);
  }
}
