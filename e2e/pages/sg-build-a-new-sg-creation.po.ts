import { browser, by, element, protractor } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SGBuildANewSGCreation extends CloudstackUiPage {
  getSGItemsFromList() {
    return element
      .all(by.css('.mat-list mat-list-base'))
      .all(by.css('.mat-line'))
      .element(by.tagName('h5'))
      .getText();
  }

  // проверить что поле селектед темплэйтс пустое
  //
}
