import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Iso, IsoService, Template, TemplateService } from '../../template/shared';
import { TemplateFilters } from '../../template/shared/base-template.service';


@Injectable()
export class VmCreationService {
  constructor(
    private templateService: TemplateService,
    private isoService: IsoService
  ) {}

  public getTemplates(): Observable<Array<Template>> {
    const filters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable
    ];

    return this.templateService.getGroupedTemplates({}, filters)
      .map(templates => templates.toArray());
  }

  public getIsos(): Observable<Array<Iso>> {
    const params = { bootable: true };
    const filters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable
    ];

    return this.isoService.getGroupedTemplates(params, filters)
      .map(isos => isos.toArray());
  }
}
