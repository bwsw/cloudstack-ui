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
      .all(by.css('.entity-card-title.mat-card-title'))
      .last()
      .element(by.tagName('span'))
      .getText();

    // return element(by.cssContainingText('.entity-card-title.mat-card-title',name));
  }

  getElementFromRules() {
    /* let rules = [];
    element(by.css('.mat-list.mat-list-base.ng-star-inserted span.ng-star-inserted'))
      .all(by.tagName('span'))
      .first()
      .getText().then( (text) => {
        return rules.push(text);
    });*/
    const rule = [];
    // element.all(by.css('cs-security-group-builder-rule h5.mat-line span')).count().then(a => console.log('Count: ', a));
    return element
      .all(by.css('cs-security-group-rule tr span.ng-star-inserted'))
      .each(elem => {
        rule.push(elem.getText());
      })
      .then(() => {
        return Promise.all(rule);
      });
  }

  getSGDescriptionCard() {
    return element
      .all(by.css('.entity-card-data-line.ng-star-inserted'))
      .all(by.tagName('span'))
      .last()
      .getText();
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
