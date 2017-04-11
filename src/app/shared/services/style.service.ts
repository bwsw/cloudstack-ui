import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { StorageService } from './storage.service';
import { Color } from '../models';
import { ConfigService } from './config.service';


@Injectable()
export class StyleService {
  public styleElement: HTMLLinkElement;
  public paletteUpdates = new Subject<Color>();

  constructor(
    private configService: ConfigService,
    private storageService: StorageService
  ) {}

  public loadPalette(): void {
    this.initStyleSheet();

    this.configService.get([
      'themeColors',
      'defaultTheme'
    ])
      .subscribe(([themeColors, defaultTheme]) => {
        let primaryColorName = this.storageService.read('primaryColor') || defaultTheme.primaryColor;
        let accentColorName = this.storageService.read('accentColor')  || defaultTheme.accentColor;

        let primaryColor = themeColors.find(color => color.name === primaryColorName);
        let accentColor = themeColors.find(color => color.name === accentColorName);

        this.updatePalette(primaryColor, accentColor);
      });
  }

  public updatePalette(primaryColor: Color, accentColor: Color): void {
    this.styleElement.href = `https://code.getmdl.io/1.3.0/material.${primaryColor.name}-${accentColor.name}.min.css`;
    this.storageService.write('primaryColor', primaryColor.name);
    this.storageService.write('accentColor', accentColor.name);
    this.paletteUpdates.next(primaryColor);
  }

  private initStyleSheet(): void {
    this.styleElement = document.createElement('link');
    this.styleElement.setAttribute('rel', 'stylesheet');
    document.head.appendChild(this.styleElement);
  }
}
