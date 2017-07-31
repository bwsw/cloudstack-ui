import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Color } from '../models';
import { ConfigService } from './config.service';
import { UserService } from './user.service';


interface Theme {
  primaryColor: string;
  accentColor: string;
}

interface ThemeData {
  primaryColor: string;
  accentColor: string;
  defaultTheme: Theme;
  themeColors: Array<Color>;
}

const fallbackTheme: Theme = {
  primaryColor: 'blue',
  accentColor: 'red'
};

const fallbackThemeColors: Array<Color> = [
  {
    name: 'red',
    value: '#F44336',
    textColor: '#FFFFFF'
  },
  {
    name: 'blue',
    value: '#2196F3',
    textColor: '#FFFFFF'
  }
];

@Injectable()
export class StyleService {
  public styleElement: HTMLLinkElement;
  public paletteUpdates = new Subject<Color>();

  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {}

  public loadPalette(): void {
    this.initStyleSheet();

    this.getThemeData()
      .subscribe(themeData => {
        const primaryColor = themeData.themeColors.find(color => color.name === themeData.primaryColor) ||
          themeData.themeColors[0];
        const accentColor = themeData.themeColors.find(color => color.name === themeData.accentColor) ||
          themeData.themeColors[1];
        this.updatePalette(primaryColor, accentColor);
      });
  }

  public getThemeData(): Observable<ThemeData> {
    return Observable.forkJoin(
      this.userService.readTag('primaryColor'),
      this.userService.readTag('accentColor')
    )
      .map(([primaryColor, accentColor]) => {
        let defaultTheme = this.configService.get('defaultTheme');
        let themeColors = this.configService.get('themeColors');

        if (!defaultTheme || !defaultTheme['primaryColor'] || !defaultTheme['accentColor']) {
          defaultTheme = undefined;
        }

        if (!themeColors  || themeColors.length < 2) {
          defaultTheme = undefined;
          themeColors = undefined;
          primaryColor = undefined;
          accentColor = undefined;
        }

        return {
          primaryColor: primaryColor || (defaultTheme && defaultTheme['primaryColor']) || fallbackTheme['primaryColor'],
          accentColor: accentColor || (defaultTheme && defaultTheme['accentColor']) || fallbackTheme['accentColor'],
          defaultTheme: defaultTheme || fallbackTheme,
          themeColors: themeColors || fallbackThemeColors
        };
      });
  }

  public setPalette(primaryColor: Color, accentColor: Color): void {
    this.userService.writeTag('primaryColor', primaryColor.name).subscribe();
    this.userService.writeTag('accentColor', accentColor.name).subscribe();
    this.updatePalette(primaryColor, accentColor);
  }

  public updatePalette(primaryColor: Color, accentColor: Color): void {
    this.styleElement.href = `https://code.getmdl.io/1.3.0/material.${primaryColor.name}-${accentColor.name}.min.css`;
    this.paletteUpdates.next(primaryColor);
  }

  private initStyleSheet(): void {
    this.styleElement = document.createElement('link');
    this.styleElement.setAttribute('rel', 'stylesheet');
    document.head.appendChild(this.styleElement);
  }
}
