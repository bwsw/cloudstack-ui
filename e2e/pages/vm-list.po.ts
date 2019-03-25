import { CloudstackUiPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';

export class VMList extends CloudstackUiPage {
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
      .all(by.css('.entity-card.mat-card.light-background'))
      .get(index)
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenAccessVM() {
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('mat-list'))), 5000);
    browser
      .actions()
      .mouseMove(element.all(by.css('.mdi-dots-vertical')).first())
      .click()
      .perform();
    browser
      .actions()
      .mouseMove(
        element(
          by.xpath(
            "//mat-icon[contains(@class,'mdi-laptop')]/ancestor::button[contains(@class,'mat-menu-item')]",
          ),
        ),
      )
      .click()
      .perform();
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
