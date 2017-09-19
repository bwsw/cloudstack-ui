import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../shared/template/template.service';
import { BaseTemplateZonesComponent } from './zones.component';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Template } from '../../shared/template/template.model';


@Component({
  selector: 'cs-template-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class TemplateZonesComponent extends BaseTemplateZonesComponent<Template> {
  constructor(
    service: TemplateService,
    route: ActivatedRoute,
    dialogService: DialogService
  ) {
    super(service, route, dialogService);
  }
}
