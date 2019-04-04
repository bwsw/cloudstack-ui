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
    return element(by.xpath(`//mat-card-title//span[text()="${diskname}"]`)).isPresent();
  }

  getDiskSize(disksize) {
    return element.all(by.cssContainingText('.mat-card-content div', disksize)).isPresent();
  }

  getDiskState() {
    return element
      .all(by.css('.mat-card-content div'))
      .get(1)
      .getText();
  }

  openSidebarReadyDisk() {
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

  openDiskSidebar(name) {
    browser
      .actions()
      .mouseMove(element(by.xpath(`//span[text()="${name}"]/ancestor:: mat-card`)))
      .perform();
    browser
      .actions()
      .click()
      .perform();
    const EC = browser.ExpectedConditions;
    browser.wait(EC.presenceOf(element(by.css('.open'))), 5000, "Sidebar doesn't open");
  }

  findDiskSize(diskname) {
    return element(
      by.xpath(
        `//span[text()="${diskname}"]/ancestor::mat-card//div[@class="entity-card-data-line"][1]`,
      ),
    ).getText();
  }
}
