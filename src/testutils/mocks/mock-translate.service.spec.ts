import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
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
      return of({ key });
    } else {
      const result = key.reduce((acc, element) => {
        return Object.assign(acc, { [element]: element });
      }, {});

      return of(result);
    }
  }

  public instant(key: string | Array<string>): string {
    return key.toString();
  }
}
