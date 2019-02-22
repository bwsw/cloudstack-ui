import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SecurityGroupCreation extends CloudstackUiPage {
  setSGTemplateName(name) {
    const inputName = element(by.name('name'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(inputName), 2000, 'No display name').then(() => {
      inputName.sendKeys(name);
      browser.wait(EC.textToBePresentInElementValue(element(by.name('name')), name));
      expect(inputName.getAttribute('value')).toBe(name);
    });
  }

  clickADDbutton() {
    element(by.css('.fancy-select-button mat-button')).click();
  }
}
