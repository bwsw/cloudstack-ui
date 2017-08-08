import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Languages } from '../../app/shared/services/language.service';


export class MockTranslateService {
  public onLangChange: EventEmitter<void>;

  constructor() {
    this.onLangChange = new EventEmitter<void>();
  }

  public get currentLang(): string {
    return Languages.en;
  }

  public get(key: string | Array<string>): Observable<string | any> {
    return Observable.of(key);
  }
}
