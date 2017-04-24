import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  Color,
  LanguageService,
  StyleService
} from '../shared';
import { AuthService, UserService, NotificationService } from '../shared/services';


@Component({
  selector: 'cs-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public accentColor: Color;
  public language: string;
  public primaryColor: Color;
  public primaryColors: Array<Color>;

  public passwordUpdateForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private languageService: LanguageService,
    private notificationService: NotificationService,
    private styleService: StyleService,
    private userService: UserService
) { }

  public ngOnInit(): void {
    this.getLanguage();
    this.loadColors();
    this.buildForm();
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
    this.styleService.setPalette(this.primaryColor, this.accentColor);
  }

  public updatePassword(): void {
    this.userService.updatePassword(this.authService.userId, this.password)
      .subscribe(
        () => {},
        error => this.notificationService.error(error.errortext)
      );
    this.passwordUpdateForm.reset();
  }

  private get password(): string {
    return this.passwordUpdateForm.controls['password'].value;
  }

  private getLanguage(): void {
    this.languageService.getLanguage().subscribe(language => this.language = language);
  }

  private loadColors(): void {
    this.styleService.getThemeData()
      .subscribe(themeData => {
        this.primaryColors = themeData.themeColors;
        this.primaryColor = themeData.themeColors.find(color => color.name === themeData.primaryColor) ||
          themeData.themeColors[0];
        this.accentColor = this.accentColors.find(color => color.name === themeData.accentColor) ||
          themeData.themeColors[1];
      });
  }

  private buildForm(): void {
    this.passwordUpdateForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required]
    }, { validator: this.passwordsNotEqual });
  }

  private passwordsNotEqual(formGroup: FormGroup): { passwordsNotEqual: true } | null {
    let valid = formGroup.controls['password'].value === formGroup.controls['passwordRepeat'].value;
    return valid ? null : { passwordsNotEqual: true };
  }
}
