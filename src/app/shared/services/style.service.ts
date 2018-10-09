import { Injectable } from '@angular/core';

export interface Theme {
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

  constructor() {
    this.initStyleSheet();
  }

  private initStyleSheet(): void {
    this.styleElement = document.createElement('link');
    this.styleElement.setAttribute('rel', 'stylesheet');
    document.head.appendChild(this.styleElement);
  }

  public updateTheme(theme: Theme) {
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

  public useTheme(themeName: string) {
    const newTheme = themes.find(theme => theme.name === themeName);
    this.updateTheme(newTheme);
  }
}
