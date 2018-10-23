import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Color } from '../../../shared/models';
import { Theme } from '../../../shared/services/style.service';

@Component({
  selector: 'cs-theme-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-color-picker
      [colors]="colors"
      [selectedColor]="selectedColor"
      (changed)="onSelectionChange($event)"
    ></cs-color-picker>
  `,
})
export class ThemeSelectorComponent implements OnChanges {
  @Input()
  themes: Theme[];
  @Input()
  currentThemeName: string;
  @Output()
  selectionChange = new EventEmitter<Theme>();
  public colors: Color[];
  public selectedColor: Color;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.themes) {
      this.setColors(changes.themes.currentValue);
    }
    if (changes.currentThemeName) {
      this.setSelectedColor(changes.currentThemeName.currentValue);
    }
  }

  public onSelectionChange(color: Color) {
    const selectedTheme = this.themes.find(theme => theme.primaryColor === color.value);
    this.selectionChange.emit(selectedTheme);
  }

  private setColors(themes: Theme[]) {
    this.colors = themes.map(theme => new Color(theme.name, theme.primaryColor));
  }

  private setSelectedColor(themeName: string) {
    const currentTheme = this.themes.find(theme => theme.name === themeName);
    this.selectedColor = new Color(currentTheme.name, currentTheme.primaryColor);
  }
}
