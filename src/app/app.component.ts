import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import '../style/app.scss';
import { AsyncJobService } from './shared/services/async-job.service';
import { AuthService } from './shared/services/auth.service';
import { CacheService } from './shared/services/cache.service';
import { ErrorService } from './shared/services/error.service';
import { LanguageService } from './shared/services/language.service';
import { MemoryStorageService } from './shared/services/memory-storage.service';
import { NotificationService } from './shared/services/notification.service';
import { RouterUtilsService } from './shared/services/router-utils.service';
import { SessionStorageService } from './shared/services/session-storage.service';
import { StyleService } from './shared/services/style.service';
import { UserService } from './shared/services/user.service';
import { lang } from 'moment';

@Component({
  selector: 'cs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private asyncJobService: AsyncJobService,
    private sessionStorage: SessionStorageService,
    private memoryStorage: MemoryStorageService,
    private notification: NotificationService,
    private styleService: StyleService,
    private userService: UserService,
    private routerUtilsService: RouterUtilsService,
  ) {
  }

  public ngOnInit(): void {
    this.languageService
      .applyLanguage(this.languageService.defaultLanguage)
      .subscribe();

    this.auth.loggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userService.startIdleMonitor();
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
      .switchMap(language => this.languageService.setLanguage(language))
      .subscribe();
    this.styleService.getTheme()
      .switchMap(theme => this.styleService.setTheme(theme))
      .subscribe();
  }

  private storageReset() {
    this.sessionStorage.reset();
    this.memoryStorage.reset();
  }
}
