import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs';
import { UserService } from './user.service';


const DEFAULT_LANGUAGE = 'en';

@Injectable()
export class LanguageService {
  constructor(
    private storage: StorageService,
    private translate: TranslateService,
    private userService: UserService
  ) {}

  public getLanguage(): Observable<string> {
    return this.userService.readTag('lang').map(lang => {
      return lang || this.defaultLanguage;
    });
  }

  public setLanguage(lang: string): void {
    this.storage.write('lang', lang);
    this.userService.writeTag('lang', lang).subscribe(() => this.applyLanguage());
  }

  public applyLanguage(): void {
    this.getLanguage().subscribe(lang => this.translate.use(lang));
  }

  private get defaultLanguage(): string {
    return navigator.language || DEFAULT_LANGUAGE;
  }
}
