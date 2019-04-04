import { browser, by, element, protractor } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SGList extends CloudstackUiPage {
  clickSharedTab() {
    browser
      .actions()
      .mouseMove(
        element(
          by.xpath("//button[@name='viewMode']/descendant::div[text()=' Shared Security Groups ']"),
        ),
      )
      .perform();
    browser
      .actions()
      .click()
      .perform();
    const EC = protractor.ExpectedConditions;
    browser.wait(
      EC.visibilityOf(
        element(by.xpath(`//mat-card-title/child::span[text()="${browser.params.rule}"]`)),
      ),
      5000,
    );
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
    browser
      .actions()
      .mouseMove(element(by.xpath(`//span[text()="${name}"]/ancestor:: mat-card`)))
      .perform();
    browser
      .actions()
      .click()
      .perform();
    const EC = protractor.ExpectedConditions;
    const backdrop = EC.presenceOf(element(by.css('cs-sidebar div.open')));
    const header = EC.visibilityOf(element(by.tagName('h4')));
    const elem = EC.visibilityOf(element(by.css('cs-sidebar div.value.ng-star-inserted')));
    browser.wait(EC.and(backdrop), 5000);
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
