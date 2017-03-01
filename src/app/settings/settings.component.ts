import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../shared/services/language.service';

@Component({
  selector: 'cs-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public primaryColor: string;
  public accentColor: string;
  public language: string;

  constructor(private languageService: LanguageService) { }

  public ngOnInit(): void {
    this.language = this.languageService.getLanguage();
  }

  public changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }
}
