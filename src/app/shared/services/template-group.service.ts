import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { TemplateGroup } from '../models';
import { configSelectors, State } from '../../root-store';

@Injectable()
export class TemplateGroupService {
  constructor(private store: Store<State>) {
  }

  public getList(): Observable<Array<TemplateGroup>> {
    return this.store.select(configSelectors.get('templateGroups'));
  }
}
