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

  clickOpenSidebar(name) {
    element(by.xpath(`//span[text()="${name}"]/ancestor:: mat-card`)).click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickCreateSG() {
    element(by.css('.mat-fab.mat-accent')).click();
  }

  getSGNameCard(name) {
    return element.all(by.cssContainingText('.entity-card-title.mat-card-title', name)).isPresent();
  }

  getElementFromRules() {
    const rule = [];
    return element
      .all(by.css('cs-security-group-rule tr span.ng-star-inserted'))
      .each(elem => {
        rule.push(elem.getText());
      })
      .then(() => {
        return Promise.all(rule);
      });
  }

  getSGDescriptionCard(name, desc) {
    return element(
      by.xpath(
        `//span[text()="${name}"]/ancestor:: mat-card//mat-card-content//span[text()="${desc}"]`,
      ),
    ).isPresent();
  }

  clickSGActionBox() {
    element
      .all(by.css('.entity-card-header.mat-card-header'))
      .last()
      .element(by.tagName('button'))
      .click();
  }

  clickSGRules() {
    element(by.css('.mat-menu-content'))
      .all(by.tagName('button'))
      .first()
      .click();
  }

  closeSGRules() {
    element(by.css('.mat-dialog-actions.ng-star-inserted'))
      .all(by.tagName('button'))
      .last()
      .click();
  }
}
