import { by, element } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class VMSidebar extends CloudstackUiPage {
  getVMName() {
    return element(by.tagName('h4')).getText();
  }

  getGroup() {
    return element(by.tagName('cs-instance-group'))
      .element(by.css('.mat-card-content-container'))
      .element(by.tagName('div'))
      .getText();
  }

  getSOName() {
    return element(by.tagName('cs-service-offering-details'))
      .element(by.css('.grid.service-offering.mat-card-content-container'))
      .element(by.tagName('div'))
      .all(by.tagName('div'))
      .last()
      .getText();
  }

  getTemplate() {
    return element(by.tagName('cs-vm-detail-template'))
      .element(by.css('.mat-card-content'))
      .element(by.tagName('div'))
      .getText();
  }

  getAffGroup() {
    return element(by.tagName('cs-affinity-group'))
      .element(by.css('.mat-card-content-container'))
      .element(by.css('.key.ng-star-inserted'))
      .getText();
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

  deleteTag() {
    // element(by.css('.mdi-delete.mat-icon.mdi')).click();
  }

  getTagKey(expected) {
    return element(by.css('.mat-card-content-container')).element(
      by.cssContainingText('.key', expected),
    );
  }

  getTagValue(expected) {
    return element(by.css('.mat-card-content-container')).element(
      by.cssContainingText('.value', expected),
    );
  }
}
