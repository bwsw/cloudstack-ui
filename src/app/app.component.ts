import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { first, switchMap } from 'rxjs/operators';

import { AsyncJobService } from './shared/services/async-job.service';
import { AuthService } from './shared/services/auth.service';
import { CacheService } from './shared/services/cache.service';
import { MemoryStorageService } from './shared/services/memory-storage.service';
import { SessionStorageService } from './shared/services/session-storage.service';
import { StyleService } from './shared/services/style.service';
import { DateTimeFormatterService } from './shared/services/date-time-formatter.service';
import { State, UserTagsSelectors } from './root-store';

import * as chart_moment from 'chart.js/node_modules/moment';
import 'moment/locale/ru';
import { Language } from './shared/types';
import { Utils } from './shared/services/utils/utils.service';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
    private store: Store<State>,
  ) {}

  public ngOnInit(): void {
    this.auth.loggedIn.subscribe(() => {
      this.asyncJobService.completeAllJobs();
      CacheService.invalidateAll();
      this.storageReset();
    });

    this.configureInterface();
  }

  private configureInterface() {
    this.store.pipe(select(UserTagsSelectors.getInterfaceLanguage)).subscribe(language => {
      this.translateService.use(language);
      // set locale for moment in the chart.js
      chart_moment.locale(language);
    });

    this.store.pipe(select(UserTagsSelectors.getTimeFormat)).subscribe(timeFormat => {
      this.dateTimeFormatterService.updateFormatters(timeFormat);
      // set time formats for locale of moment in the chart.js
      chart_moment.updateLocale('en', {
        longDateFormat: Utils.getMomentLongDateFormat(Language.en, timeFormat),
      });
      chart_moment.updateLocale('ru', {
        longDateFormat: Utils.getMomentLongDateFormat(Language.ru, timeFormat),
      });
    });
    this.store
      .pipe(select(UserTagsSelectors.getTheme))
      .subscribe(themeName => this.styleService.useTheme(themeName));

    this.translateService.onLangChange
      .pipe(
        switchMap(() =>
          this.store.pipe(
            select(UserTagsSelectors.getTimeFormat),
            first(),
          ),
        ),
      )
      .subscribe(format => this.dateTimeFormatterService.updateFormatters(format));
  }

  private storageReset() {
    this.sessionStorage.reset();
    this.memoryStorage.reset();
  }
}
