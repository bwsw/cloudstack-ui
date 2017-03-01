import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../shared/services/language.service';
import { StyleService } from '../shared/services/style.service';
import { ConfigService } from '../shared/services/config.service';
import { Color } from '../shared/models/color.model';
import { StorageService } from '../shared/services/storage.service';


@Component({
  selector: 'cs-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public primaryColor: Color;
  public accentColor: Color;
  public language: string;

  public primaryColors: Array<Color>;

  constructor(
    private configService: ConfigService,
    private languageService: LanguageService,
    private storageService: StorageService,
    private styleService: StyleService
) { }

  public ngOnInit(): void {
    this.language = this.languageService.getLanguage();
    this.loadColors();
  }

  public changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }

  public updatePrimaryColor(color: Color): void {
    this.primaryColor = color;
    this.updatePalette();
  }

  public updateAccentColor(color: Color): void {
    this.accentColor = color;
    this.updatePalette();
  }

  public updatePalette(): void {
    this.styleService.updatePalette(this.primaryColor, this.accentColor);
  }

  public get accentColors(): Array<Color> {
    return this.primaryColors.filter(color => color.name !== this.primaryColor.name && !color.primaryOnly);
  }

  private loadColors(): void {
    this.configService.get('themeColors')
      .subscribe(themeColors => {
        this.primaryColors = themeColors;
        this.primaryColor = themeColors.find(color => color.name === this.storageService.read('primaryColor'));
        this.accentColor = this.accentColors.find(color => color.name === this.storageService.read('accentColor'));
      });
  }

}
