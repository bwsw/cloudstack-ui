import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../core/services';
import { TemplateGroup } from '../models/template-group.model';

@Injectable()
export class TemplateGroupService {
  constructor(private configService: ConfigService) {
  }

  public getList(): Observable<Array<TemplateGroup>> {
    return Observable.of(this.configService.get('templateGroups'));
  }
}
