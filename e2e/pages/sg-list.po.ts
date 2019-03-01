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
    element(by.css('.entity-card.mat-card')).click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickCreateSG() {
    element(by.css('.mat-fab.mat-accent')).click();
  }

  getSGNameCard() {
    return element
      .all(by.css('.entity-card-title.mat-card-title'))
      .last()
      .element(by.tagName('span'))
      .getText();
  }

  getSGDescriptionCard() {
    return element
      .all(by.css('.entity-card-data-line ng-star-inserted'))
      .last()
      .element(by.tagName('span'))
      .getText();
  }

  verifyCardName(name, description) {
    expect(this.getSGNameCard)
      .toEqual(name)
      .expect(this.getSGDescriptionCard)
      .toEqual(description);
  }
}
