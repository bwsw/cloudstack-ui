import { BaseTemplateModel } from '../../shared/base-template.model';
import { BaseTemplateService } from '../../shared/base-template.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { EntityDoesNotExistError } from '../../../shared/components/sidebar/entity-does-not-exist-error';


export abstract class BaseTemplateZonesComponent implements OnInit {
  public entity: BaseTemplateModel;
  public readyInEveryZone: boolean;
  public updating: boolean;

  private service: BaseTemplateService;

  constructor(
    service: BaseTemplateService,
    private route: ActivatedRoute,
    protected dialogService: DialogService
  ) {
    this.service = service;
  }

  public ngOnInit(): void {
    const params = this.route.snapshot.parent.params;
    this.loadEntity(params.id)
      .subscribe(entity => this.entity = entity);
  }

  public updateStatus(): void {
    if (this.entity) {
      this.updating = true;
      this.service.getWithGroupedZones(this.entity.id, null, false)
        .finally(() => this.updating = false)
        .subscribe(
          template => {
            this.entity = template;
            this.checkZones(template);
          },
          error => this.dialogService.alert({ message: error.message })
        );
    }
  }

  private checkZones(template: BaseTemplateModel): void {
    this.readyInEveryZone = template && template.zones.every(_ => _.isReady);
  }

  protected loadEntity(id: string): Observable<BaseTemplateModel> {
    return this.service.getWithGroupedZones(id)
      .switchMap(template => {
        if (template) {
          return Observable.of(template);
        } else {
          return Observable.throw(new EntityDoesNotExistError());
        }
      })
      .do(template => {
        this.checkZones(template);
      });
  }
}
