import { browser, by, element, protractor, until } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SSHList extends CloudstackUiPage {
  sshname = `shh_${this.generateID()}`;

  clickCreateSSH(name) {
    element(by.css('.mat-fab.mat-accent')).click();
    this.waitDialog();
    element(by.name('name')).sendKeys(name);
    this.clickYesDialogButton();
    this.waitDialog();
    this.clickYesDialogButton();
  }
}
