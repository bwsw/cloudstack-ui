import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Color } from '../models/color.model';
import { ConfigService } from './config.service';


const STANDARD_PRIMARY = { name: 'light_blue', value: '#03A9F4' };
const STANDARD_ACCENT = { name: 'teal', value: '#009688' };

@Injectable()
export class StyleService {
  public styleElement: HTMLLinkElement;

  constructor(
    private configService: ConfigService,
    private storageService: StorageService
  ) {}

  public loadPalette(): void {
    this.initStyleSheet();

    this.configService.get('themeColors')
      .subscribe(themeColors => {
        let primaryColorName = this.storageService.read('primaryColor');
        let accentColorName = this.storageService.read('accentColor');

        let primaryColor = themeColors.find(color => color.name === primaryColorName)  || STANDARD_PRIMARY;
        let accentColor = themeColors.find(color => color.name === accentColorName) || STANDARD_ACCENT;

        this.updatePalette(primaryColor, accentColor);
      });
  }

  public updatePalette(primaryColor: Color, accentColor: Color): void {
    this.styleElement.href = `https://code.getmdl.io/1.3.0/material.${primaryColor.name}-${accentColor.name}.min.css`;
    this.storageService.write('primaryColor', primaryColor.name);
    this.storageService.write('accentColor', accentColor.name);
  }

  private initStyleSheet(): void {
    this.styleElement = document.createElement('link');
    this.styleElement.setAttribute('rel', 'stylesheet');
    document.head.appendChild(this.styleElement);
  }
}
