///<reference path="../../node_modules/protractor/built/index.d.ts"/>
import {by, element} from 'protractor';
import {CloudstackUiPage} from './app.po';

export class Login extends CloudstackUiPage {

  e2e_login = 'admin';
  e2e_pass = 'password';

  setLogin(login: string) {
    element(by.name('username')).sendKeys(login);
  };

  setPassword (pass: string) {
    element(by.name('password')).sendKeys(pass);
  }

  setDomain(domain: string) {
    element(by.name('domain')).sendKeys(domain);
  }

  clickShowOptions() {
    element(by.css('.options-button.mat-icon-button')).click();
  }

  openDomainField() {
    element(by.css('.domains-visible')).isPresent().then(function () {
      return;
    }).catch(function () {
      element(by.css('.options-button.mat-icon-button')).click();
    });
  }

  clickLogin () {
    return this.clickButtonbyText('Login');
  }

  login() {
    this.setLogin(this.e2e_login);
    this.setPassword(this.e2e_pass);
    this.clickLogin();
  }

  logout() {
    element(by.css('a[ng-reflect-router-link=\"/logout\"]')).click();
  }

  checkDomainIsPresent() {
    return expect(element(by.name('domain')).isPresent()).toBeTruthy();
  }

  checkDomainIsNotPresent() {
    return expect(element(by.name('domain')).isPresent()).toBeFalsy();
  }
}
