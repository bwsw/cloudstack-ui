import { Observable, of } from 'rxjs';

import { Tag } from '../../../app/shared/models/tag.model';
import { Taggable } from '../../../app/shared/interfaces/taggable.interface';

export class MockTagService {
  public create(params?: {}): Observable<any> {
    return of(null);
  }

  public remove(params?: {}): Observable<any> {
    return of(null);
  }

  public getList(params?: {}): Observable<Tag[]> {
    return of([]);
  }

  public getTag(entity: any, key: string): Observable<Tag> {
    return of({ key: 'key', value: 'value' } as Tag);
  }

  public update(entity: any, entityName: string, key: string, value: any): Observable<any> {
    return of(null);
  }

  public copyTagsToEntity(tags: Tag[], entity: Taggable): Observable<any> {
    return of(null);
  }

  public getValueFromTag(tag: Tag): any {
    if (tag) {
      return tag.value;
    }
  }
}
