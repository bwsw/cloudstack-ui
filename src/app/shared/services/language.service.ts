import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';


const DEFAULT_LANGUAGE = 'en';

@Injectable()
export class LanguageService {
  constructor(
    private storage: StorageService,
    private translate: TranslateService
  ) {}

  public getLanguage(): string {
    let lang = this.storage.read('lang');
    if (lang) {
      return lang;
    }
    this.storage.write('lang', DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  }

  public setLanguage(lang: string): void {
    this.storage.write('lang', lang);
    this.applyLanguage();
  }

  public applyLanguage(): void {
    let lang = this.getLanguage();
    this.translate.use(lang);
  }
}
