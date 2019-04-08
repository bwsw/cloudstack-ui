import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class ImageList extends CloudstackUiPage {
  clickOpenSidebar() {
    browser
      .actions()
      .mouseMove(element(by.css('.entity-card.mat-card')))
      .perform();
    browser
      .actions()
      .click()
      .perform();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element.all(by.css('.mat-tab-link')).last()), 5000);
  }
}
