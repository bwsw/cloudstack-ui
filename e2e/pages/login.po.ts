///<reference path="../../node_modules/protractor/built/index.d.ts"/>
import { by, element } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class Login extends CloudstackUiPage {
  e2eLogin = 'admin';
  e2ePass = 'password';

  setLogin(login: string) {
    element(by.name('username')).sendKeys(login);
  }

  setPassword(pass: string) {
    element(by.name('password')).sendKeys(pass);
  }

  setDomain(domain: string) {
    element(by.name('domain')).sendKeys(domain);
  }

  clickShowOptions() {
    element(by.css('.options-button.mat-icon-button')).click();
  }

  openDomainField() {
    element(by.css('.domains-visible'))
      .isPresent()
      .then(() => {
        return;
      })
      .catch(() => {
        element(by.css('.options-button.mat-icon-button')).click();
      });
  }

  clickLogin() {
    return this.clickButtonbyText('Login');
  }

  login() {
    this.setLogin(this.e2eLogin);
    this.setPassword(this.e2ePass);
    this.clickLogin();
  }

  logout() {
    element(by.css('.link-element.mat-icon.mdi-exit-to-app.mdi')).click();
  }

  domainIsPresent() {
    return element(by.name('domain')).isPresent();
  }
}
