import { CloudstackUiPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';

export class DiskSidebar extends CloudstackUiPage {
  description = `new description`;
  snapshotname = 'snapshot';
  snapshotdesc = 'snapshot description';
  diskfromsnap = 'new disk';

  getDiskName(diskname) {
    return element(by.cssContainingText('.details-header', diskname)).isPresent();
  }

  getDiskSize(size) {
    return element
      .all(by.cssContainingText('.row.ng-star-inserted div', size))
      .get(0)
      .isPresent();
  }

  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }

  setDescription(description) {
    const EC = browser.ExpectedConditions;
    const elem = element(by.css('.mat-card-content span'));
    browser.wait(EC.elementToBeClickable(elem), 2000, ' Description is not clickable');
    elem.click();

    browser.wait(
      EC.presenceOf(element(by.name('textField'))),
      5000,
      "Text area of disk description doesn't present",
    );
    element(by.name('textField')).clear();
    element(by.name('textField')).sendKeys(description);
    element
      .all(by.css('.buttons button'))
      .last()
      .click();
    element
      .all(by.css('.buttons button'))
      .first()
      .isPresent();
  }

  getDescription() {
    return element(by.css('.mat-card-content span')).getText();
  }

  clickSnapshotTab() {
    const EC = browser.ExpectedConditions;
    const elem = element.all(by.css('.mat-tab-links a')).last();
    browser.wait(EC.elementToBeClickable(elem), 2000, ' Snapshot tab is not clickable');
    elem.click();
    browser.wait(
      EC.presenceOf(element(by.css('.mat-mini-fab.mat-accent.ng-star-inserted'))),
      5000,
      "Snapshot tab doesn't open",
    );
  }

  clickCreateSnapshot() {
    element(by.css('.mat-mini-fab.mat-accent.ng-star-inserted')).click();
  }

  setSnapshotName(name) {
    element(by.name('name')).clear();
    browser.sleep(2000);
    element(by.name('name')).sendKeys(name);
  }

  setSnapshotDescription(description) {
    element(by.name('description')).sendKeys(description);
  }

  getSnapshotName() {
    return element(by.css('.mat-card-title h2')).getText();
  }

  getSnapshotDescription() {
    return element(by.css('.truncate')).getText();
  }

  clickActionBoxOfSnapshot() {
    element(by.css('.mat-card-header-menu')).click();
  }

  clickCreateVolume() {
    element
      .all(by.css('.mat-menu-item.ng-star-inserted'))
      .get(1)
      .click();
  }

  setVolumeName(name) {
    element(by.name('name')).sendKeys(name);
  }

  clickDeleteSnapshot() {
    element
      .all(by.css('.mat-menu-item.ng-star-inserted'))
      .get(3)
      .click();
  }

  getNoResult(result) {
    return element(by.cssContainingText('.no-results', result)).isPresent();
  }
}
