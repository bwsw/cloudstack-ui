import { Component, OnInit } from '@angular/core';
import { Converter } from 'showdown';
import { CacheService } from '../shared/services/cache.service';
import { of } from 'rxjs/internal/observable/of';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import * as userTagsSelectors from '../root-store/server-data/user-tags/user-tags.selectors';
import { select, Store } from '@ngrx/store';
import { State } from '../reducers';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'cs-support-information',
  templateUrl: 'support-information.component.html',
  styleUrls: ['support-information.component.scss'],
})
export class SupportInformationComponent implements OnInit {
  public isShow = true;
  protected supportInformation: string;
  protected defaultPath = 'support/support-info';
  protected defaultLangPath = `${this.defaultPath}.${'md'}`;
  protected requestCache;
  protected interfaceLanguage$ = this.store.pipe(select(userTagsSelectors.getInterfaceLanguage));

  constructor(private http: HttpClient, private store: Store<State>) {}

  public ngOnInit() {
    this.initRequestCache();
    this.convertFile();
  }

  public convertFile() {
    this.readFile().subscribe(response => {
      const text = response.text();

      const converter = new Converter();
      const supportText = converter.makeHtml(text);

      this.supportInformation = supportText;
    });
  }

  public readFile() {
    const cachedRequest = this.requestCache.get();
    if (cachedRequest) {
      return cachedRequest;
    }

    const request = this.getPath().pipe(
      switchMap(responsePath => this.http.get(responsePath)),
      catchError(() => this.http.get(this.defaultLangPath)),
      catchError(error => {
        this.isShow = false;
        return throwError(error);
      }),
    );
    this.requestCache.set({ params: {}, result: request });
    return request;
  }

  public getPath() {
    return this.interfaceLanguage$.pipe(
      switchMap(lang => {
        const path = lang === 'en' ? this.defaultLangPath : `${this.defaultPath}.${lang}.${'md'}`;
        return of(path);
      }),
    );
  }

  private initRequestCache(): void {
    const cachePath = `${this.defaultPath}RequestCache`;
    this.requestCache = CacheService.create(cachePath);
  }
}
