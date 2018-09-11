import {browser, by, element, protractor} from 'protractor';

export class CloudstackUiPage {

  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  clickButtonbyText(text: string) {
    element(by.buttonText(text)).click();
  }

  clickButtonbyClass(classname: string) {
    element(by.css('.' + classname)).click();
  }

  waitUrlContains (expected: string) {
    return browser.wait(protractor.ExpectedConditions.urlContains(browser.baseUrl + '/' + expected), 5000);
  }

  checkButtonIsNotClickable(nameButton: string) {
    expect(element(by.buttonText(nameButton)).isEnabled()).toBeFalsy();
  }

  waitRedirect (expected) {
    return browser.wait(protractor.ExpectedConditions.urlIs(browser.baseUrl + '/' + expected), 5000);
  }

  cancelVMPropose () {
    element(by.id('cdk-overlay-0')).isPresent().then(function () {
      return element.all(by.css('.mat-button.mat-primary.ng-star-inserted')).get(1).click();
    });
  }

  waitVMPropose () {
    return browser.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.cdk-overlay-pane'))), 5000);
  }

  checkUrlToContain (expected) {
    return expect(browser.getCurrentUrl()).toContain(browser.baseUrl + '/' + expected);
  }
}
