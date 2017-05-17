import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';


export class MockTranslateService {
  public onLangChange: EventEmitter<void>;

  constructor() {
    this.onLangChange = new EventEmitter<void>();
  }

  public get currentLang(): string {
    return 'en';
  }

  public get(key: string | Array<string>): Observable<string | any> {
    return Observable.of(key);
  }
}
