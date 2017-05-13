import { ListService } from '../shared/components/list/list.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TemplateListService extends ListService {
  public showDetails(id: string, template?: boolean): void {
    let newId: string;
    if (template != null) {
      newId = `${template ? 'template' : 'iso'}/${id}`;
    }
    super.showDetails(newId);
  }
}
