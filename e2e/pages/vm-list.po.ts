import { CloudstackUiPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';

export class VMList extends CloudstackUiPage {
  cancelVMPropose() {
    element(by.css('.cdk-overlay-pane'))
      .isPresent()
      .then(() => {
        return element
          .all(by.css('.mat-button.mat-primary.ng-star-inserted'))
          .get(1)
          .click();
      });
  }

  waitVMPropose() {
    return browser.wait(
      protractor.ExpectedConditions.presenceOf(element(by.css('.cdk-overlay-pane'))),
      5000,
    );
  }
}
