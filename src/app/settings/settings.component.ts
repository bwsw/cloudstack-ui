import { Component, OnInit } from '@angular/core';

import {
  Color,
  ConfigService,
  LanguageService,
  StorageService,
  StyleService
} from '../shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { NotificationService } from '../shared/services/notification.service';


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
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private languageService: LanguageService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private styleService: StyleService,
    private userService: UserService
) { }

  public ngOnInit(): void {
    this.language = this.languageService.getLanguage();
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
    this.styleService.updatePalette(this.primaryColor, this.accentColor);
  }

  public updatePassword(): void {
    this.passwordUpdateForm.reset();
    this.userService.updatePassword(this.authService.userId, this.password)
      .subscribe(
        () => {},
        error => this.notificationService.error(error.json()['updateuserresponse'].errortext)
      );
  }

  private get password(): string {
    return this.passwordUpdateForm.controls['password'].value;
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
