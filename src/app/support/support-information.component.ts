import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Converter } from 'showdown';
import { UserTagService } from '../shared/services/tags/user-tag.service';
import { Observable } from 'rxjs/Observable';
import { FormattedResponse } from '../shared/services/base-backend.service';
import { Cache } from '../shared/services/cache';
import { CacheService } from '../shared/services/cache.service';

@Component({
  selector: 'cs-support-information',
  templateUrl: 'support-information.component.html',
  styleUrls: ['support-information.component.scss']
})
export class SupportInformationComponent implements OnInit {
  protected supportInformation: string;
  protected defaultPath = 'support/support-info';
  protected defaultLangPath = `${this.defaultPath}.${'md'}`;
  protected isShow = true;
  protected requestCache: Cache<Observable<FormattedResponse<string>>>;

  constructor(
    private http: Http,
    private userTagService: UserTagService
  ) {
  }

  public ngOnInit() {
    this.initRequestCache();
    this.convertFile();
  }

  public convertFile() {
    this.readFile()
      .map(response => response.text())
      .map(text => {
        const converter = new Converter();
        return converter.makeHtml(text);
      })
      .subscribe(supportText => {
        this.supportInformation = supportText;
      });
  }

  public readFile() {
    const cachedRequest = this.requestCache.get();
    if (cachedRequest) {
      return cachedRequest;
    } else {
      const request = this.getPath()
        .switchMap(responsePath => this.http.get(responsePath))
        .catch(() => this.http.get(this.defaultLangPath))
        .catch(error => {
          this.isShow = false;
          return Observable.throw(error);
        });
      this.requestCache.set({params: {}, result: request});
      return request;
    }
  }

  public getPath() {
    return this.userTagService.getLang()
      .switchMap(lang => {
        const path = lang === 'en' ? this.defaultLangPath : `${this.defaultPath}.${lang}.${'md'}`;
        return Observable.of(path);
      })
  }

  private initRequestCache(): void {
    const cachePath = `${this.defaultPath}RequestCache`;
    this.requestCache = CacheService.create<Observable<FormattedResponse<string>>>(cachePath);
  }
}
