import { Injectable } from '@angular/core';
import { Color } from '../models/color.model';
import { ConfigService } from './config.service';
import { Subject, Observable } from 'rxjs';
import { UserService } from './user.service';


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

    this.configService.get([
      'themeColors',
      'defaultTheme'
    ])
      .subscribe(([themeColors, defaultTheme]) => {
        Observable.forkJoin([
          this.userService.readTag('primaryColor'),
          this.userService.readTag('accentColor')
        ])
          .subscribe(([primary, accent]) => {
            const primaryColorName = primary || defaultTheme.primaryColor;
            const accentColorName = accent || defaultTheme.accentColor;

            const primaryColor = themeColors.find(color => color.name === primaryColorName);
            const accentColor = themeColors.find(color => color.name === accentColorName);

            this.updatePalette(primaryColor, accentColor);
          });
      });
  }

  public updatePalette(primaryColor: Color, accentColor: Color): void {
    this.styleElement.href = `https://code.getmdl.io/1.3.0/material.${primaryColor.name}-${accentColor.name}.min.css`;
    this.userService.writeTag('primaryColor', primaryColor.name).subscribe();
    this.userService.writeTag('accentColor', accentColor.name).subscribe();
    this.paletteUpdates.next(primaryColor);
  }

  private initStyleSheet(): void {
    this.styleElement = document.createElement('link');
    this.styleElement.setAttribute('rel', 'stylesheet');
    document.head.appendChild(this.styleElement);
  }
}
