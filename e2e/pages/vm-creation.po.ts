import { Login } from './login.po';
import { by, element } from 'protractor';

export class VMCreation extends Login {
  clickVMSection() {
    const linkactive = element(by.css('a[ng-reflect-router-link-active=link-active]'));
    return linkactive.element(by.css('.mat-icon.mdi-cloud.mdi')).click();
  }

  clickSelectInstSource() {
    const createwindow = element(by.id('cdk-overlay-2'));
    return createwindow
      .all(by.buttonText('Select'))
      .get(1)
      .click();
  }
}
