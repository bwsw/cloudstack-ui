import { CloudstackUiPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';

export class DiskSidebar extends CloudstackUiPage {
  getDiskName(diskname) {
    return element(by.cssContainingText('.details-header', diskname)).isPresent();
  }

  getDiskSize(size) {
    return element
      .all(by.cssContainingText('.row.ng-star-inserted div', size))
      .get(0)
      .isPresent();
  }

  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }
}
