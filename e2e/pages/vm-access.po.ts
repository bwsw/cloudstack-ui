import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class AccessVM extends CloudstackUiPage {
  getTitle() {
    return element(by.tagName('h3')).getText();
  }

  getConsoleButton() {
    return element(by.css('.action-link'));
  }

  clickClose() {
    element(by.css('.mat-button.mat-primary')).click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.urlIs(`${browser.baseUrl}/instances`), 5000, 'Access VM is not closed');
  }

  clickSSHTab() {
    element(by.cssContainingText('.mat-tab-label-content', 'SSH')).click();
    const EC = protractor.ExpectedConditions;
    const ssh = EC.visibilityOf(element(by.css('.parameters-wrapper.ng-star-inserted')));
    const icon = EC.visibilityOf(element(by.css('.mdi-content-copy.mat-icon.mdi')));
    browser.wait(EC.and(icon, ssh), 5000, 'ssh tab is empty').catch(() => {
      return element(by.css('.mat-button.mat-primary')).click();
    });
  }

  clickHTTPTab() {
    element
      .all(by.css('.mat-tab-label.mat-ripple.ng-star-inserted'))
      .last()
      .click();
    const EC = protractor.ExpectedConditions;
    browser
      .wait(
        EC.visibilityOf(element(by.css('.parameters-wrapper.ng-star-inserted'))),
        5000,
        'http tab is empty',
      )
      .catch(() => {
        return element(by.css('.mat-button.mat-primary')).click();
      });
  }

  getConnectionString() {
    return element(by.css('.parameters-wrapper.ng-star-inserted'))
      .all(by.tagName('p'))
      .first();
  }

  getLogin() {
    return element(by.css('.parameters-wrapper.ng-star-inserted'))
      .all(by.tagName('p'))
      .get(3);
  }

  getPort() {
    return element(by.css('.parameters-wrapper.ng-star-inserted'))
      .all(by.tagName('p'))
      .get(2);
  }

  getWebshellButton() {
    return element(by.linkText('Open WebShell'));
  }

  getHttpLogin() {
    return element(by.css('.parameters-wrapper.ng-star-inserted'))
      .all(by.tagName('p'))
      .first();
  }

  getHttpPassword() {
    return element(by.css('.parameters-wrapper.ng-star-inserted'))
      .all(by.tagName('p'))
      .get(1);
  }
}
