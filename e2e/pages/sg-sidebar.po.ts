import { by, element } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SGSidebar extends CloudstackUiPage {
  getSGbyName(name) {
    return element(by.cssContainingText('.ng-star-inserted', name));
  }

  getSGbyType(type) {
    return element
      .all(by.css('.mat-card ng-star-inserted'))
      .last()
      .element(by.css('.value ng-star-inserted'))
      .getText();
  }

  clickTagsTab() {
    element(by.css('.mat-tab-link ng-star-inserted')).click();
  }

  clickFirewallTab() {
    element(by.css('.mat-tab-link mat-tab-label-active')).click();
  }

  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }
}
