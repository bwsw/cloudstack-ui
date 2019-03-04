import { browser, by, element, protractor } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SGList extends CloudstackUiPage {
  clickSharedTab() {
    element
      .all(by.name('viewMode'))
      .get(2)
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.css('.entity-card.mat-card'))), 5000);
  }

  clickPrivateTab() {
    element
      .all(by.name('viewMode'))
      .get(3)
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.css('.entity-card.mat-card'))), 5000);
  }

  clickOpenSidebar() {
    element
      .all(by.css('.entity-card.mat-card'))
      .last()
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickCreateSG() {
    element(by.css('.mat-fab.mat-accent')).click();
  }

  getSGNameCard() {
    return element
      .all(by.css('.entity-card-title mat-card-title'))
      .last()
      .element(by.tagName('span'))
      .getText();
  }

  getElementFromRules() {
    return element(by.css('.mat-list.mat-list-base.ng-star-inserted'))
      .all(by.tagName('span'))
      .first()
      .getText();
  }

  getSGDescriptionCard() {
    return element
      .all(by.css('.entity-card-data-line.ng-star-inserted'))
      .all(by.tagName('span'))
      .last()
      .getText();
  }

  clickSGMenu() {
    element
      .all(by.css('.entity-card-header.mat-card-header'))
      .last()
      .element(by.tagName('button'))
      .click();
  }

  clickRulesbutton() {
    element(by.css('.mat-menu-content'))
      .all(by.tagName('button'))
      .first()
      .click();
  }

  verifyCardInfo(name, description, sgrules) {
    // click "Rules" button
    expect(this.getElementFromRules).toContain(sgrules);
    element(by.css('.mat-dialog-actions.ng-star-inserted'))
      .all(by.tagName('button'))
      .last()
      .click(); // click "close"
  }
}
