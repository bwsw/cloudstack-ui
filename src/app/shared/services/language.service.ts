import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs';


const DEFAULT_LANGUAGE = 'en';

@Injectable()
export class LanguageService {
  constructor(
    private storage: StorageService,
    private translate: TranslateService
  ) {}

  public getLanguage(): Observable<string> {
    return this.storage.readRemote('lang')
      .map(lang => lang || this.defaultLanguage);
  }

  public setLanguage(lang: string): void {
    this.storage.writeRemote('lang', lang).subscribe(() => this.applyLanguage());
  }

  public applyLanguage(): void {
    this.getLanguage().subscribe(lang => this.translate.use(lang));
  }

  private get defaultLanguage(): string {
    return DEFAULT_LANGUAGE;
  }
}
