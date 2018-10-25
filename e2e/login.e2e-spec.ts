import { Login } from './pages/login.po';
import { browser } from 'protractor';
import { VMList } from './pages/vm-list.po';

describe('e2e-test-login', () => {
  let page: Login;
  let vmlist: VMList;

  beforeEach(() => {
    page = new Login();
    vmlist = new VMList();
    page.navigateTo();
  });

  it('Show/Hide options: domain', () => {
    expect(page.domainIsPresent()).toBeFalsy();
    page.clickShowOptions();
    expect(page.domainIsPresent()).toBeTruthy();
    page.clickShowOptions();
    expect(page.domainIsPresent()).toBeFalsy();
  });

  it('Can not login by incorrect password', () => {
    page.setLogin(page.e2eLogin);
    page.setPassword('incorrect');
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  it('Can not login by Uppercase password', () => {
    page.setLogin(page.e2eLogin);
    page.setPassword(page.e2ePass.toUpperCase());
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  // Стандартно на симуляторе пароль в нижнем регистре.
  // Нужно либо создавать нового пользователя, либо отказываться от этой проверки
  /*
  it('Can not login by Lowercase password', () => {
    page.setLogin(page.e2eLogin);
    page.setPassword(page.e2ePass.toLowerCase());
    page.clickLogin();
    page.checkUrlToContain('login');
  });
  */

  it('Can not login by incorrect login', () => {
    page.setLogin('incorrect');
    page.setPassword(page.e2ePass);
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  it('Login is required', () => {
    page.setPassword(page.e2ePass);
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  it('Password is required', () => {
    page.setLogin(page.e2eLogin);
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  it('Can login by correct settings: login, password, domain', () => {
    page.waitUrlContains('login');
    page.login();
    browser.waitForAngularEnabled(false);
    page.waitRedirect('instances');
    page.checkUrlToContain('instances');
    vmlist.waitVMPropose();
    vmlist.cancelVMPropose();
    page.logout();
    page.waitUrlContains('login');
  });

  it('After logout no access for instance page', () => {
    page.waitUrlContains('login');
    page.login();
    browser.waitForAngularEnabled(false);
    page.waitRedirect('instances');
    vmlist.waitVMPropose();
    vmlist.cancelVMPropose();
    page.logout();
    page.waitUrlContains('login');
    browser.get(`${browser.baseUrl}/instances`);
    page.waitUrlContains('login');
    page.checkUrlToContain('login');
  });
});
