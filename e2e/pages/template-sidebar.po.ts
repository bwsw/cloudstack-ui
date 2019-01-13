import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class ImageSidebar extends CloudstackUiPage {
  setTag(key, value) {
    const EC = protractor.ExpectedConditions;
    element(by.css('.mdi-plus.mat-icon.mdi')).click();
    this.waitDialogModal();
    const input1 = element(by.name('key'));
    const input2 = element(by.name('value'));
    browser.wait(EC.visibilityOf(input1)).then(() => {
      input1.sendKeys(key);
      browser.wait(EC.textToBePresentInElementValue(element(by.name('key')), key));
      expect(input1.getAttribute('value')).toBe(key);
    });
    browser.wait(EC.visibilityOf(input2)).then(() => {
      input2.sendKeys(value);
      browser.wait(EC.textToBePresentInElementValue(element(by.name('value')), value));
      expect(input2.getAttribute('value')).toBe(value);
    });
    this.clickYesDialogButton();
    browser.wait(
      EC.textToBePresentInElement(element.all(by.cssContainingText('.key', key)).last(), key),
      5000,
    );
  }

  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }

  clickTagTab() {
    element
      .all(by.css('.mat-tab-link'))
      .last()
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.css('.mdi-plus.mat-icon.mdi'))), 5000);
  }

  clickShowSystemTab() {
    element(by.name('showSystemTags')).click();
  }
}
