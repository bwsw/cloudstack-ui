import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { AsyncJobService } from './shared/services/async-job.service';
import { AuthService } from './shared/services/auth.service';
import { CacheService } from './shared/services/cache.service';
import { MemoryStorageService } from './shared/services/memory-storage.service';
import { SessionStorageService } from './shared/services/session-storage.service';
import { StyleService } from './shared/services/style.service';
import { UserService } from './shared/services/user.service';
import { DateTimeFormatterService } from './shared/services/date-time-formatter.service';
import { State, UserTagsSelectors } from './root-store';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private dateTimeFormatterService: DateTimeFormatterService,
    private translateService: TranslateService,
    private asyncJobService: AsyncJobService,
    private sessionStorage: SessionStorageService,
    private memoryStorage: MemoryStorageService,
    private styleService: StyleService,
    private userService: UserService,
    private store: Store<State>
  ) {
  }

  public ngOnInit(): void {
    this.auth.loggedIn.subscribe(() => {
      this.asyncJobService.completeAllJobs();
      CacheService.invalidateAll();
      this.storageReset();
    });

    this.configureInterface();
  }


  private configureInterface() {
    this.store.select(UserTagsSelectors.getInterfaceLanguage)
      .subscribe(language => this.translateService.use(language));

    this.store.select(UserTagsSelectors.getTimeFormat)
      .subscribe(timeFormat => this.dateTimeFormatterService.updateFormatters(timeFormat));

    this.store.select(UserTagsSelectors.getTheme)
      .subscribe(themeName => this.styleService.useTheme(themeName));

    this.translateService.onLangChange
      .switchMap(() => this.store.select(UserTagsSelectors.getTimeFormat).first())
      .subscribe((format) =>
        this.dateTimeFormatterService.updateFormatters(format)
      );
  }

  private storageReset() {
    this.sessionStorage.reset();
    this.memoryStorage.reset();
  }
}
