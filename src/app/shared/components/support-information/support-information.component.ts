import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Converter } from 'showdown';
import { UserTagService } from '../../services/tags/user-tag.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cs-support-information',
  templateUrl: 'support-information.component.html',
  styleUrls: ['support-information.component.scss']
})
export class SupportInformationComponent implements OnInit {
  public expandSupportInfo = false;
  public supportInformation: string;
  public defaultPath = 'support/support-info';
  public defaultLangPath = `${this.defaultPath}.${'md'}`;

  public isShow = true;

  constructor(
    private http: Http,
    private userTagService: UserTagService
  ) {
  }

  public ngOnInit() {
    this.convertFile();
  }

  public toggleSupportInfo(): void {
    this.expandSupportInfo = !this.expandSupportInfo;
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
    return this.getPath()
      .switchMap(responsePath => this.http.get(responsePath))
      .catch(() => this.http.get(this.defaultLangPath))
      .catch(error => {
        this.isShow = false;
        return Observable.throw(error);
      });
  }

  public getPath() {
    return this.userTagService.getLang()
      .switchMap(lang => {
        const path = lang === 'en' ? this.defaultLangPath : `${this.defaultPath}.${lang}.${'md'}`;
        return Observable.of(path);
      })
  }
}
