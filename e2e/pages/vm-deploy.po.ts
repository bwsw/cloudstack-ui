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
    browser.wait(EC.visibilityOf(element.all(by.css('.mat-button.mat-primary')).last()), 20000);
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
