import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../app/shared/types';


export class MockTranslateService {
  public onLangChange: EventEmitter<void>;

  constructor() {
    this.onLangChange = new EventEmitter<void>();
  }

  public get currentLang(): string {
    return Language.en;
  }

  public get(key: string | Array<string>): Observable<string | any> {
    if (typeof key === 'string') {
      return Observable.of({ key });
    } else {
      const result = key.reduce((acc, element) => {
        return Object.assign(acc, { [element]: element });
      }, {});

      return Observable.of(result);
    }
  }

  public instant(key: string | Array<string>): string {
    return key.toString();
  }
}
