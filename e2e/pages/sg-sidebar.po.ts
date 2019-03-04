import { by, element } from 'protractor';
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

  clickTagsTab() {
    element(by.css('.mat-tab-link.ng-star-inserted')).click();
  }

  clickFirewallTab() {
    element(by.css('.mat-tab-link.mat-tab-label-active')).click();
  }

  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }

  getFirewallTabInfo(index) {
    element
      .all(by.css('.flex-container.container'))
      .get(index)
      .element(by.css('value.ng-star-inserted'))
      .getText();
  }

  verifySidebar(name, description) {
    expect(this.getFirewallTabInfo(1)).toContain(name);
    expect(this.getFirewallTabInfo(2)).toContain(description); // from 0 count
    expect(this.getFirewallTabInfo(3)).toContain('custom-template');
    this.clickTagsTab();
    expect(element(by.css('.value')).getText()).toContain('custom-template');
    this.clickClose();
  }
}
