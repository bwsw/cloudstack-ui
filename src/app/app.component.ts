import '../style/app.scss';
import { Component, OnInit } from '@angular/core';
import { AsyncJobService } from './shared/services/async-job.service';
import { AuthService } from './shared/services/auth.service';
import { CacheService } from './shared/services/cache.service';
import { LanguageService } from './shared/services/language.service';
import { MemoryStorageService } from './shared/services/memory-storage.service';
import { SessionStorageService } from './shared/services/session-storage.service';
import { StyleService } from './shared/services/style.service';
import { UserService } from './shared/services/user.service';
import { DateTimeFormatterService } from './shared/services/date-time-formatter.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private languageService: LanguageService,
    private dateTimeFormatterService: DateTimeFormatterService,
    private translateService: TranslateService,
    private asyncJobService: AsyncJobService,
    private sessionStorage: SessionStorageService,
    private memoryStorage: MemoryStorageService,
    private styleService: StyleService,
    private userService: UserService
  ) {
  }

  public ngOnInit(): void {
    this.languageService
      .applyLanguage(this.languageService.defaultLanguage)
      .subscribe();

    this.auth.loggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userService.startIdleMonitor();
        this.languageService.getTimeFormat()
          .subscribe(timeFormat => {
            this.dateTimeFormatterService.updateFormatters(timeFormat);
          });
        this.translateService.onLangChange
          .switchMap(() => this.languageService.getTimeFormat())
          .subscribe((format) =>
            this.dateTimeFormatterService.updateFormatters(format)
          );
        this.loadSettings();
      } else {
        this.userService.stopIdleMonitor();
      }
      this.asyncJobService.completeAllJobs();
      CacheService.invalidateAll();
      this.storageReset();
    });
  }

  private loadSettings(): void {
    this.languageService.getLanguage()
      .switchMap(language => this.languageService.applyLanguage(language))
      .subscribe();
    this.styleService.getTheme()
      .subscribe(theme => this.styleService.updateTheme(theme));
  }

  private storageReset() {
    this.sessionStorage.reset();
    this.memoryStorage.reset();
  }
}
