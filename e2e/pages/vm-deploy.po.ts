import { browser, by, element, protractor } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class VMDeploy extends CloudstackUiPage {
  progressText = 'Deployment finished';
  deployText = 'Virtual Machine Successfully Created';

  clickClose() {
    element
      .all(by.css('.mat-button.mat-primary'))
      .last()
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.urlIs(`${browser.baseUrl}/instances`), 5000);
  }

  waitVMDeploy() {
    const EC = protractor.ExpectedConditions;
    browser.wait(
      protractor.ExpectedConditions.visibilityOf(element(by.css('snack-bar-container'))),
      20000,
      'No snack message Create VM appears',
    );
    const header = EC.textToBePresentInElement(
      element(by.tagName('h3')),
      'Virtual Machine Successfully Created',
    );
    const snack = EC.stalenessOf(element(by.css('snack-bar-container')));
    const button = EC.visibilityOf(element.all(by.css('.mat-button.mat-primary')).last());
    browser.wait(EC.and(header, button, snack), 20000, 'Error for deploying VM occurs');
  }

  getProgressText() {
    return element(by.css('.progress-text.highlighted-message')).getText();
  }

  getDeployText() {
    return element(by.tagName('h3')).getText();
  }

  getConsoleButton() {
    return element(by.css('.mat-button.mat-primary.ng-star-inserted'));
  }

  getVMIp() {
    return element(by.cssContainingText('h4', 'IP')).getText();
  }

  getVMName(name) {
    return element(by.cssContainingText('h4', name)).getText();
  }

  getVMGroup() {}

  getVMAffGroup() {}
}
