import {Login} from './pages/login.po';
import {browser} from 'protractor';


describe('e2e-test-login', () => {
  let page: Login;

  beforeAll(() => {

  });

  beforeEach(() => {
    page = new Login();
    page.navigateTo();
  });

  it('Show/Hide options: domain', () => {
    page.checkDomainIsNotPresent();
    page.clickShowOptions();
    page.checkDomainIsPresent();
    page.clickShowOptions();
    page.checkDomainIsNotPresent();
  });

  it('Can\'t login by incorrect password', () => {
    page.setLogin(page.e2e_login);
    page.setPassword('incorrect');
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  it('Can\'t login by Uppercase password', () => {
    page.setLogin(page.e2e_login);
    page.setPassword(page.e2e_pass.toUpperCase());
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  // Стандартно на симуляторе пароль в нижнем регистре.
  // Нужно либо создавать нового пользователя, либо отказываться от этой проверки
  /*
  it('Can\'t login by Lowercase password', () => {
    page.setLogin(page.e2e_login);
    page.setPassword(page.e2e_pass.toLowerCase());
    page.clickLogin();
    page.checkUrlToContain('login');
  });
  */
  it('Can\'t login by incorrect login', () => {
    page.setLogin('incorrect');
    page.setPassword(page.e2e_pass);
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  it('Login is required', () => {
    page.setPassword(page.e2e_pass);
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  it('Password is required', () => {
    page.setLogin(page.e2e_login);
    page.clickLogin();
    page.checkUrlToContain('login');
  });

  it('Can login by correct settings: login, password, domain', () => {
    page.login();
    browser.waitForAngularEnabled(false);
    page.waitRedirect('instances');
    page.checkUrlToContain('instances');
    page.cancelVMPropose();
    page.logout();
  });

  it('After logout no access for instance page', () => {
    page.login();
    browser.waitForAngularEnabled(false);
    page.waitRedirect('instances');
    page.waitVMPropose();
    page.cancelVMPropose();
    page.logout();
    page.waitUrlContains('login');
    browser.get(browser.baseUrl + '/instances');
    page.waitUrlContains('login');
    page.checkUrlToContain('login');
  });
});
