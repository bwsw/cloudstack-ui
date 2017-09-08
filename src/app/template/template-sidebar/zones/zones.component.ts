import { BaseTemplateModel } from '../../shared/base/base-template.model';
import { BaseTemplateService } from '../../shared/base/base-template.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';


export abstract class BaseTemplateZonesComponent<M extends BaseTemplateModel> implements OnInit {
  public entity: M;
  public readyInEveryZone: boolean;
  public updating: boolean;

  private service: BaseTemplateService<M>;

  constructor(
    service: BaseTemplateService<M>,
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

  private checkZones(template: M): void {
    this.readyInEveryZone = template && template.zones.every(_ => _.isReady);
  }

  protected loadEntity(id: string): Observable<M> {
    return this.service.getWithGroupedZones(id)
      .switchMap(template => {
        if (template) {
          return Observable.of(template);
        } else {
          return Observable.throw('ENTITY_DOES_NOT_EXIST');
        }
      })
      .do(template => {
        this.checkZones(template);
      });
  }
}
