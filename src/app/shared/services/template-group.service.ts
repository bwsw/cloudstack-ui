import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TemplateGroup } from '../models';
import { configSelectors, State } from '../../root-store';

@Injectable()
export class TemplateGroupService {
  constructor(private store: Store<State>) {
  }

  public getList(): Observable<Array<TemplateGroup>> {
    return this.store.pipe(select(configSelectors.get('templateGroups')));
  }
}
