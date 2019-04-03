import { protractor, browser, by, element } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SGSidebar extends CloudstackUiPage {
  getVMbyName(name) {
    return element(by.cssContainingText('.ng-star-inserted', name));
  }

  getSGbyType(type) {
    return element
      .all(by.css('.mat-card.ng-star-inserted'))
      .last()
      .element(by.css('.value.ng-star-inserted'))
      .getText();
  }

  getSGName() {
    return element
      .all(by.css('div.value.ng-star-inserted'))
      .get(1)
      .getText();
  }

  getSGType() {
    return element
      .all(by.css('div.value.ng-star-inserted'))
      .last()
      .getText();
  }
  getSGDescription() {
    return element
      .all(by.css('div.value.ng-star-inserted'))
      .get(2)
      .getText();
  }

  clickChekbox() {
    // in custom sidebar tags (checkbox1)
    element(by.css('.mat-checkbox-inner-container')).click();
  }

  clickFirewallTab() {
    element(by.css('.mat-tab-link.mat-tab-label-active')).click();
  }

  clickTagTab() {
    element
      .all(by.css('.mat-tab-link'))
      .last()
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.css('.mdi-plus.mat-icon.mdi'))), 5000);
  }

  getTagKey(expected) {
    return element(by.css('.mat-card-content-container')).element(
      by.cssContainingText('.key', expected),
    );
  }

  getTagValue(expected) {
    return element(by.cssContainingText('div .value', expected));
  }
}
