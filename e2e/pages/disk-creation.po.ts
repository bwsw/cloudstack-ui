import { CloudstackUiPage } from './app.po';
import { element, by, protractor, browser } from 'protractor';

export class DiskCreation extends CloudstackUiPage {
  diskcustom = 'diskcustom';
  diskfixed = 'diskfixed';

  setName(diskname: string) {
    element(by.name('name')).sendKeys(diskname);
  }

  setZone() {
    element(by.name('zone')).click();
    element(by.css('.mat-option-text')).click();
  }

  setCustomDO() {
    const EC = browser.ExpectedConditions;
    element(by.css('cs-volume-creation-dialog button.mat-button')).click();
    this.waitDialog();
    const elem = element(by.xpath('//div[contains(text(),"Custom")]/ancestor::mat-radio-button'));
    browser.wait(EC.elementToBeClickable(elem), 2000, ' Custom radiobutton is not clickable');
    elem.click();
    this.clickYesDialogButton();
    browser.wait(
      EC.presenceOf(element(by.name('new-size'))),
      2000,
      "Disk size input doesn't present for selected custom DO in Disk Creation modal",
    );
  }

  selectFixedDO() {
    element(by.css('cs-volume-creation-dialog button.mat-button')).click();
    this.waitDialog();
    element(by.xpath('//div[contains(text(),"Medium")]/ancestor::mat-radio-button')).click();
    this.clickYesDialogButton();
    const EC = browser.ExpectedConditions;
    browser.wait(
      EC.presenceOf(element(by.css('cs-volume-creation-dialog'))),
      2000,
      "Dialog of disk creation doesn't present",
    );
  }

  setDiskSize(size: number) {
    element(by.xpath('//cs-slider//input[@type="number"]')).sendKeys(size);
  }
}
