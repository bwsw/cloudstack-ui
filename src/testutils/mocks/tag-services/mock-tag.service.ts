import { Observable } from 'rxjs/Observable';
import { Tag } from '../../../app/shared/models/tag.model';
import { Taggable } from '../../../app/shared/interfaces/taggable.interface';


export class MockTagService {
  public create(params?: {}): Observable<any> {
    return Observable.of(null);
  }

  public remove(params?: {}): Observable<any> {
    return Observable.of(null);
  }

  public getList(params?: {}): Observable<Array<Tag>> {
    return Observable.of([]);
  }

  public getTag(entity: any, key: string): Observable<Tag> {
    return Observable.of({ key: 'key', value: 'value' } as Tag);
  }

  public update(entity: any, entityName: string, key: string, value: any): Observable<any> {
    return Observable.of(null);
  }

  public copyTagsToEntity(tags: Array<Tag>, entity: Taggable): Observable<any> {
    return Observable.of(null);
  }

  public getValueFromTag(tag: Tag): any {
    if (tag) {
      return tag.value;
    }
  }
}
