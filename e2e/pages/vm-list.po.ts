import { CloudstackUiPage } from './app.po';
import { browser, by, element, ExpectedConditions, protractor } from 'protractor';

export class VMList extends CloudstackUiPage {
  EC = protractor.ExpectedConditions;

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
    browser.wait(
      ExpectedConditions.elementToBeClickable(element(by.css('button.mat-fab.mat-accent'))),
      2000,
      'Create VM button is not clickable',
    );
    element(by.css('button.mat-fab.mat-accent')).click();
  }

  clickOpenSidebar(index) {
    const elem = element.all(by.css('cs-vm-list mat-card')).get(index);
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(this.EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenSidebarRunning() {
    const elem = element
      .all(by.xpath("//mat-icon[contains(@class,'running')]/ancestor::mat-card"))
      .first();
    browser.wait(this.EC.visibilityOf(elem), 5000);
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(this.EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenSidebarStopped() {
    const elem = element
      .all(by.xpath("//mat-icon[contains(@class,'stopped')]/ancestor::mat-card"))
      .first();
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(this.EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenAccessVM() {
    browser.wait(
      this.EC.elementToBeClickable(element(by.css('button.entity-card-menu.mat-icon-button'))),
      5000,
    );
    const elem = element.all(by.css('button.entity-card-menu.mat-icon-button')).first();
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(
      this.EC.visibilityOf(
        element(
          by.xpath(
            "//mat-icon[contains(@class,'mdi-laptop')]/ancestor::button[contains(@class,'mat-menu-item')]",
          ),
        ),
      ),
      2000,
      'No action menu items appear',
    );

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
    browser.wait(this.EC.visibilityOf(element(by.tagName('h3'))), 5000);
  }

  getStateRunning() {
    return element(by.css('.mdi-circle.mat-icon.mdi.running'));
  }

  getStateStopped() {
    return element(by.css('.mdi-circle.mat-icon.mdi.stopped'));
  }
}
