import { CloudstackUiPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';
import { el } from '@angular/platform-browser/testing/src/browser_util';

export class VMList extends CloudstackUiPage {
  getVMNameCard(index) {
    return element
      .all(by.css('.entity-card-title.mat-card-title'))
      .get(index)
      .element(by.tagName('span'))
      .getText();
  }

  getVMOSCard(index) {
    return element
      .all(by.tagName('mat-card'))
      .get(index)
      .all(by.css('.entity-card-data-line'))
      .first()
      .getText();
  }

  getVMIPCard(index) {
    return element
      .all(by.tagName('mat-card'))
      .get(index)
      .all(by.css('.entity-card-data-line'))
      .last();
  }

  clickCreateVM() {
    element(by.css('.mat-fab.mat-accent')).click();
  }

  clickOpenSidebar(index) {
    element
      .all(by.css('.entity-card.mat-card.light-background'))
      .get(index)
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenAccessVM(index) {
    const EC = protractor.ExpectedConditions;
    // browser.wait(EC.elementToBeClickable(element (by.css(".entity-card-menu.mat-icon-button"))), 5000);
    element
      .all(by.css('.mdi-dots-vertical'))
      .get(index)
      .click();
    element
      .all(by.css('.mat-menu-item.ng-star-inserted'))
      .last()
      .click();
    this.waitDialogModal();
    browser.wait(EC.visibilityOf(element(by.tagName('h3'))), 5000);
  }

  getStateRunning() {
    return element(by.css('.mdi-circle.mat-icon.mdi.running'));
  }

  getStateStopped() {
    return element(by.css('.mdi-circle.mat-icon.mdi.stopped'));
  }
}
