import { by, element, browser, protractor } from 'protractor';
import { CloudstackUiPage } from './app.po';
import { consoleTestResultHandler } from 'tslint/lib/test';

export class DiskList extends CloudstackUiPage {
  disknotification = 'Volume created';
  diskstate = 'State: Allocated';

  clickSpareDrives() {
    element(by.name('volumeOnly')).click();
  }

  getDiskName(diskname) {
    return element.all(by.cssContainingText('mat-card-title span', diskname)).isPresent();
  }

  getDiskSize(disksize) {
    return element.all(by.cssContainingText('.mat-card-content div', disksize)).isPresent();
  }

  clickReadyDisk() {
    element
      .all(
        by.xpath(
          `//div[@class='entity-card-data-line' and contains(text(),"State: Ready")]/ancestor::mat-card`,
        ),
      )
      .first()
      .click();
    const EC = browser.ExpectedConditions;
    browser.wait(EC.presenceOf(element(by.css('.open'))), 5000, "Sidebar doesn't open");
  }

  getSizeReadyDisk() {
    return element
      .all(
        by.xpath(
          `//div[@class='entity-card-data-line' and contains(text(),"State: Ready")]/ancestor::mat-card//div[@class="entity-card-data-line"][1]`,
        ),
      )
      .first()
      .getText();
  }

  clickCreateDisk() {
    element(by.css('.mat-fab.mat-accent')).click();
  }

  openDiskSidebar() {
    element
      .all(by.css('.entity-card.mat-card'))
      .last()
      .click();
    const EC = browser.ExpectedConditions;
    browser.wait(EC.presenceOf(element(by.css('.open'))), 5000, "Sidebar doesn't open");
  }
  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }

  findDiskSize(diskname) {
    return element(
      by.xpath(
        `//span[text()="${diskname}"]/ancestor::mat-card//div[@class="entity-card-data-line"][1]`,
      ),
    ).getText();
  }
}
