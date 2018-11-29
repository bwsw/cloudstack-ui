import { CloudstackUiPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';
import { el } from '@angular/platform-browser/testing/src/browser_util';

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

  confirmVMPropose() {
    element(by.css('.cdk-overlay-pane'))
      .isPresent()
      .then(() => {
        return element
          .all(by.css('.mat-button.mat-primary.ng-star-inserted'))
          .get(0)
          .click();
      });
  }

  waitVMPropose() {
    return browser.wait(
      protractor.ExpectedConditions.presenceOf(element(by.css('.cdk-overlay-pane'))),
      5000,
    );
  }

  getVMPropose() {
    return element(by.css('.cdk-overlay-pane'));
  }

  getVMNameCard() {
    return element(by.css('.entity-card-title.mat-card-title'))
      .element(by.tagName('span'))
      .getText();
  }

  getVMOSCard() {
    return element
      .all(by.css('.entity-card-data-line'))
      .first()
      .getText();
  }

  getVMIPCard() {
    return element.all(by.css('.entity-card-data-line')).last();
  }

  clickCreateVM() {
    element(by.css('.mat-fab.mat-accent')).click();
    // const EC = protractor.ExpectedConditions;
    // browser.wait(EC.visibilityOf( element(by.css('#mat-tab-label-0-1'))), 5000);
  }

  clickOpenSidebar() {
    element(by.css('.entity-card.mat-card.light-background')).click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenAccessVM() {
    const EC = protractor.ExpectedConditions;
    // browser.wait(EC.elementToBeClickable(element (by.css(".entity-card-menu.mat-icon-button"))), 5000);
    element(by.css('.mdi-dots-vertical')).click();
    element
      .all(by.css('.mat-menu-item.ng-star-inserted'))
      .last()
      .click();
    this.waitDialogModal();
    browser.wait(EC.visibilityOf(element(by.tagName('h3'))), 5000);
  }

  getStateRunning() {
    return element(by.css('.mdi-circle.mat-icon.mdi.running'));
  }

  getStateStopped() {
    return element(by.css('.mdi-circle.mat-icon.mdi.stopped'));
  }

  /*verifyVMByName(value: string) {
    return element.all(by.css('.entity-card-title.mat-card-title')).each( function (row) {
      expect(row.element(by.cssContainingText('span', value)).isPresent()).toBeTruthy();
    });
  }*/
}
