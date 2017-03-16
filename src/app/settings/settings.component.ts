import { Component, OnInit } from '@angular/core';

import {
  Color,
  ConfigService,
  LanguageService,
  StorageService,
  StyleService
} from '../shared';


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

  public get accentColors(): Array<Color> {
    return this.primaryColors.filter(color => color.name !== this.primaryColor.name && !color.primaryOnly);
  }

  private get firstAvailableAccentColor(): Color {
    try {
      return this.primaryColor !== this.accentColors[0] ? this.accentColors[0] : this.accentColors[1];
    } catch (e) {
      throw new Error('Incorrect color configuration');
    }
  }

  public changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }

  public updatePrimaryColor(color: Color): void {
    this.primaryColor = color;
    if (this.primaryColor.value === this.accentColor.value) {
      this.accentColor = this.firstAvailableAccentColor;
    }
    this.updatePalette();
  }

  public updateAccentColor(color: Color): void {
    this.accentColor = color;
    this.updatePalette();
  }

  public updatePalette(): void {
    this.styleService.updatePalette(this.primaryColor, this.accentColor);
  }

  private loadColors(): void {
    this.configService.get('themeColors')
      .subscribe(themeColors => {
        let primaryColorName = this.storageService.read('primaryColor');
        let accentColorName = this.storageService.read('accentColor');

        this.primaryColors = themeColors;
        this.primaryColor = themeColors.find(color => color.name === primaryColorName);
        this.accentColor = this.accentColors.find(color => color.name === accentColorName);
      });
  }

}
