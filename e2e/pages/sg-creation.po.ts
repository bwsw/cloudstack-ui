import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SecurityGroupCreation extends CloudstackUiPage {
  clickCreateSG() {
    element(by.css('.mat-fab.mat-accent')).click();
  }

  getSGNameCard() {
    return element
      .all(by.css('.entity-card-title.mat-card-title'))
      .first()
      .element(by.tagName('span'))
      .getText();
  }

  getSGDescriptionCard() {
    return element
      .all(by.css('.entity-card-data-line ng-star-inserted'))
      .last()
      .element(by.tagName('span'))
      .getText();
  }
}
