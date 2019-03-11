import { CloudstackUiPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';

export class VMList extends CloudstackUiPage {
  getVMColor(index) {
    return element
      .all(by.tagName('cs-vm-list mat-card'))
      .get(index)
      .getAttribute('style');
  }

  getVMNameCard() {
    return element
      .all(by.css('.entity-card-title.mat-card-title'))
      .first()
      .element(by.tagName('span'))
      .getText();
  }

  getVMOSCard(index) {
    return element
      .all(by.css('.entity-card-data-line'))
      .get(2 * index)
      .getText();
  }

  getVMIPCard(index) {
    return element.all(by.css('.entity-card-data-line')).get(2 * index + 1);
  }

  clickCreateVM() {
    element(by.css('.mat-fab.mat-accent')).click();
  }

  clickOpenSidebar(index) {
    element
      .all(by.css('cs-vm-list mat-card'))
      .get(index)
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenSidebarRunning() {
    element
      .all(by.xpath("//mat-icon[contains(@class,'running')]/ancestor::mat-card"))
      .first()
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenAccessVM() {
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('mat-list'))), 5000);
    element
      .all(by.css('.mdi-dots-vertical'))
      .first()
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
