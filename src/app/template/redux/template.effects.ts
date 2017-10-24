import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { TemplateService } from '../shared/template.service';
import { TemplateFilters } from '../shared/base-template.service';
import { AuthService } from '../../shared/services/auth.service';
import { IsoService } from '../shared/iso.service';
import { Template } from '../shared/template.model';
import { Iso } from '../shared/iso.model';

import * as template from './template.actions';
import { TemplateCreateAction } from '../../shared/actions/template-actions/create/template-create';
import { IsoCreateAction } from '../../shared/actions/template-actions/create/iso-create';

@Injectable()
export class TemplateEffects {
  @Effect()
  loadFilterTemplatesByGroupings$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_FILTER_UPDATE)
    .map((action: template.TemplatesFilterUpdate) =>
      new template.LoadTemplatesRequest({
        ...action.payload,
        currentUser: this.authService.user
      }));

  @Effect()
  loadTemplates$: Observable<Action> = this.actions$
    .ofType(template.LOAD_TEMPLATE_REQUEST)
    .switchMap((action: template.LoadTemplatesRequest) => {
      let filters = [
        TemplateFilters.featured,
        TemplateFilters.self
      ];

      if (this.authService.isAdmin()) {
        filters = [TemplateFilters.all];
      } else if (action.payload.selectedTypes.length) {
        filters = action.payload.selectedTypes;
      }

      return Observable.forkJoin(
        this.templateService.getGroupedTemplates<Template>({}, filters, true)
          .map(_ => _.toArray()),
        this.isoService.getGroupedTemplates<Iso>({}, filters, true)
          .map(_ => _.toArray())
      )
        .map(([templates, isos]) => {
          return new template.LoadTemplatesResponse([
            ...templates,
            ...isos
          ]);
        });
    });

  @Effect()
  loadTemplatesResponse$: Observable<Action> = this.actions$
    .ofType(template.LOAD_TEMPLATE_RESPONSE)
    .map((action: template.LoadTemplatesResponse) => new template.LoadTemplatesResponseStop());


  constructor(
    private actions$: Actions,
    private templateService: TemplateService,
    private isoService: IsoService,
    private authService: AuthService
  ) {
  }

}
