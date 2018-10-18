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

  public get(key: string | string[]): Observable<string | any> {
    if (typeof key === 'string') {
      return of({ key });
    }

    const result = key.reduce((acc, element) => {
      return { ...acc, [element]: element };
    }, {});

    return of(result);
  }

  public instant(key: string | string[]): string {
    return key.toString();
  }
}
