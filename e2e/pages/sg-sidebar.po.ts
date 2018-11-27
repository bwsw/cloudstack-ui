import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SGSidebar extends CloudstackUiPage {
  getVMbyName(name) {
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.cssContainingText('.ng-star-inserted', name))), 5000);
    return element(by.cssContainingText('.ng-star-inserted', name));
  }
}
