import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../app/shared/services/language.service';


export class MockTranslateService {
  public onLangChange: EventEmitter<void>;

  constructor() {
    this.onLangChange = new EventEmitter<void>();
  }

  public get currentLang(): string {
    return Language.en;
  }

  public get(key: string | Array<string>): Observable<string | any> {
    return Observable.of(key);
  }
}
