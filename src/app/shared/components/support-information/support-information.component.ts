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

  constructor(
    private http: Http,
    private userTagService: UserTagService
  ) {
  }

  public ngOnInit() {
    this.readFile();
  }

  public toggleSupportInfo(): void {
    this.expandSupportInfo = !this.expandSupportInfo;
  }

  public readFile() {
    const defaultPath = 'support/support-information';
    this.userTagService.getLang()
      .switchMap(lang => {
        const path = lang === 'en' ? `${defaultPath}.${'md'}` : `${defaultPath}.${lang}.${'md'}`;
        return Observable.of(path);
      })
      .switchMap(responsePath => this.http.get(responsePath))
      .map(response => response.text())
      .map(text => {
        const converter = new Converter();
        return text ? converter.makeHtml(text) : 'dd';
      })
      .subscribe(supportText => {
        this.supportInformation = supportText;
      });
  }
}
