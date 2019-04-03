import { CloudstackUiPage } from './app.po';
import { browser, by, element, ExpectedConditions, protractor } from 'protractor';

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
    browser.wait(
      ExpectedConditions.elementToBeClickable(element(by.css('button.mat-fab.mat-accent'))),
      2000,
      'Create VM button is not clickable',
    );
    element(by.css('button.mat-fab.mat-accent')).click();
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
    browser.wait(
      EC.elementToBeClickable(element(by.css('button.entity-card-menu.mat-icon-button'))),
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
      EC.visibilityOf(
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
    browser.wait(EC.visibilityOf(element(by.tagName('h3'))), 5000);
  }

  getStateRunning() {
    return element(by.css('.mdi-circle.mat-icon.mdi.running'));
  }

  getStateStopped() {
    return element(by.css('.mdi-circle.mat-icon.mdi.stopped'));
  }
}
