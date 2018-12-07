import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class Settings extends CloudstackUiPage {
  setSavePassword() {
    element(by.name('saveVmPassword')).click();
  }
}
