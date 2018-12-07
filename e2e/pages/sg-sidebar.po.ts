import { by, element } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SGSidebar extends CloudstackUiPage {
  getVMbyName(name) {
    return element(by.cssContainingText('.ng-star-inserted', name));
  }

  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }
}
