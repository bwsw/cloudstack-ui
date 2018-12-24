import { by, element } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class Settings extends CloudstackUiPage {
  setSavePassword() {
    element(by.name('saveVmPassword')).click();
  }
}
