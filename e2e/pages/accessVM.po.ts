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
    browser.wait(EC.urlIs(`${browser.baseUrl}/instances`), 5000);
  }
}
