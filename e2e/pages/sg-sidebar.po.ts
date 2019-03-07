import { browser, by, element, protractor } from 'protractor';
import { CloudstackUiPage } from './app.po';
import { el } from '@angular/platform-browser/testing/src/browser_util';

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

  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }

  clickTagTab() {
    element
      .all(by.css('.mat-tab-link'))
      .last()
      .click();
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
