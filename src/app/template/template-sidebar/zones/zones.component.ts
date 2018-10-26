import { Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { BaseTemplateModel } from '../../shared/base-template.model';
import { BaseTemplateService } from '../../shared/base-template.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

export abstract class BaseTemplateZonesComponent implements OnInit {
  @Input()
  public entity: BaseTemplateModel;
  public readyInEveryZone: boolean;
  public updating: boolean;

  private service: BaseTemplateService;

  constructor(service: BaseTemplateService, protected dialogService: DialogService) {
    this.service = service;
  }

  public ngOnInit() {
    this.updateStatus();
  }

  public updateStatus(): void {
    if (this.entity) {
      this.updating = true;
      this.service
        .getWithGroupedZones(this.entity.id, null, false)
        .pipe(finalize(() => (this.updating = false)))
        .subscribe(
          template => {
            this.entity = template;
            this.checkZones(template);
          },
          error => this.dialogService.alert({ message: error.message }),
        );
    }
  }

  private checkZones(template: BaseTemplateModel): void {
    this.readyInEveryZone = template && template.zones.every(_ => _.isready);
  }
}
