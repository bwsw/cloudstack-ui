import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Color } from '../models';
import { ConfigService } from './config.service';
import { UserTagService } from './tags/user/user-tag.service';

interface Theme {
  name: string;
  href: string;
  primaryColor: string;
}

export const themes: Array<Theme> = [
  {
    name: 'blue-red',
    href: 'css/themes/blue-red.css',
    primaryColor: '#2196f3'
  },
  {
    name: 'indigo-pink',
    href: 'css/themes/indigo-pink.css',
    primaryColor: '#3f51b5'
  }
];

const preferredTheme = themes[0]; // the blue-red one is default

@Injectable()
export class StyleService {
  public styleElement: HTMLLinkElement;
  private _activeTheme: Theme;

  constructor(
    private configService: ConfigService,
    private userTagService: UserTagService
  ) {}

  public loadPalette(): void {
    this.initStyleSheet();

    this.getTheme()
      .subscribe(theme =>
        this.updateTheme(theme));
  }

  public getTheme(): Observable<Theme> {
    const defaultThemeName =
      this.configService.get<string>('defaultThemeName');
    return this.userTagService.getTheme()
      .map(themeName => {
        let theme = themes.find(t => t.name === themeName);
        if (!theme){
          // if the tag has incorrect theme name, we fallback to default theme
          // from the config
          theme = themes.find(t => t.name === defaultThemeName);
        }

        // if the config has incorrect theme name too, we just grab the first one

        return theme || preferredTheme;
      });
  }

  public setTheme(primaryColor: Color): void {
    const theme = themes.find(t => t.primaryColor === primaryColor.value);
    if (theme) {
      this.updateTheme(theme);
      this.userTagService.setTheme(theme.name).subscribe();
    }
  }

  private initStyleSheet(): void {
    this.styleElement = document.createElement('link');
    this.styleElement.setAttribute('rel', 'stylesheet');
    document.head.appendChild(this.styleElement);
  }

  private updateTheme(theme: Theme) {
    const { styleElement, _activeTheme } = this;

    // to prevent setting the theme when it's already active
    const hasChanged = _activeTheme && _activeTheme.href !== theme.href;
    // to prevent setting the default theme twice after user is
    // logged in (when the app loads, the default theme loads with it and
    // the linkElement has empty href, but the user can explicitly
    // set the default theme in the tag)
    const notPreferredAfterLogin =
      !styleElement.href && theme.name !== preferredTheme.name;

    if (hasChanged || notPreferredAfterLogin) {
      styleElement.href = theme.href;
    }
    this._activeTheme = theme;
  }
}
