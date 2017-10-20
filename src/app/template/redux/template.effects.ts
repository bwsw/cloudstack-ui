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

@Injectable()
export class TemplateEffects {
  @Effect()
  loadFilterTemplatesByGroupings$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_FILTER_UPDATE)
    .map((action: template.TemplatesFilterUpdate) => new template.LoadTemplatesRequest(
      action.payload));

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
      } else if (action.payload.selectedTypes) {
        filters = action.payload.selectedTypes;
      }

      return Observable.forkJoin(
        this.templateService.getGroupedTemplates<Template>({}, filters, true)
          .map(_ => _.toArray()),
        this.isoService.getGroupedTemplates<Iso>({}, filters, true)
          .map(_ => _.toArray())
      )
        .map(([templates, isos]) => new template.LoadTemplatesResponse([
          ...templates,
          ...isos
        ]));
    });

  constructor(
    private actions$: Actions,
    private templateService: TemplateService,
    private isoService: IsoService,
    private authService: AuthService
  ) {
  }
}
