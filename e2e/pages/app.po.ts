import { browser, by, element, protractor } from 'protractor';

export class CloudstackUiPage {
  navigateTo(path) {
    return browser.get(path);
  }

  clickMainMenu() {
    element
      .all(by.css('.mdi-menu.mat-icon.mdi'))
      .last()
      .click();
    const EC = protractor.ExpectedConditions;
    const accounts = EC.elementToBeClickable(
      element(by.css('.mat-icon.mdi-account-supervisor.mdi')),
    );
    const vm = EC.elementToBeClickable(element(by.css('.mat-icon.mdi-cloud.mdi')));
    browser.wait(EC.and(accounts, vm), 5000);
  }

  clickMainAccounts() {
    element(by.css('.mat-icon.mdi-account-supervisor.mdi')).click();
    const EC = protractor.ExpectedConditions;
    const url = EC.urlIs(`${browser.baseUrl}/accounts`);
    const setting = EC.elementToBeClickable(element(by.css('.mat-icon.mdi-settings.mdi')));
    const calendar = EC.elementToBeClickable(element(by.css('.mat-icon.mdi-calendar-text.mdi')));
    const a = EC.presenceOf(element(by.linkText('Settings')));
    browser.wait(EC.and(url, setting, a, calendar), 5000);
  }

  clickMainVM() {
    element
      .all(by.css('.mat-icon.mdi-cloud.mdi'))
      .first()
      .click();
    const EC = protractor.ExpectedConditions;
    const security = EC.elementToBeClickable(element(by.css('.mat-icon.mdi-security.mdi')));
    const image = EC.elementToBeClickable(element.all(by.css('.mat-icon.mdi-disc.mdi')).last());
    const vm = EC.elementToBeClickable(element.all(by.css('.mat-icon.mdi-cloud.mdi')).last());
    const url = EC.urlIs(`${browser.baseUrl}/instances`);
    browser.wait(EC.and(image, security, vm, url), 5000);
  }

  clickSettings() {
    const EC = protractor.ExpectedConditions;
    const url = EC.urlIs(`${browser.baseUrl}/accounts`);
    const setting = EC.elementToBeClickable(element(by.css('.mat-icon.mdi-settings.mdi')));
    const calendar = EC.elementToBeClickable(element(by.css('.mat-icon.mdi-calendar-text.mdi')));
    const a = EC.presenceOf(element(by.linkText('Settings')));
    browser.wait(EC.and(url, setting, a, calendar), 5000).then(() => {
      element(by.css('.mat-icon.mdi-settings.mdi')).click();
    });
  }

  clickFirewallMenu() {
    element(by.css('.mat-icon.mdi-security.mdi')).click();
  }

  clickStorageMenu() {
    const EC = protractor.ExpectedConditions;
    const storage = EC.elementToBeClickable(element(by.css('.mat-icon.mdi-server.mdi')));
    browser.wait(EC.and(storage), 5000).then(() => {
      element(by.css('.mat-icon.mdi-server.mdi')).click();
    });
  }

  clickVMMenu() {
    element
      .all(by.css('.mat-icon.mdi-cloud.mdi'))
      .last()
      .click();
  }

  clickImageMenu() {
    const EC = protractor.ExpectedConditions;
    const security = EC.elementToBeClickable(element(by.css('.mat-icon.mdi-security.mdi')));
    const image = EC.elementToBeClickable(element.all(by.css('.mat-icon.mdi-disc.mdi')).last());
    const vm = EC.elementToBeClickable(element.all(by.css('.mat-icon.mdi-cloud.mdi')).last());
    const url = EC.urlIs(`${browser.baseUrl}/instances`);
    browser.wait(EC.and(image, security, vm, url), 5000).then(() => {
      element
        .all(by.css('.mat-icon.mdi-disc.mdi'))
        .last()
        .click();
    });
    browser.wait(
      protractor.ExpectedConditions.presenceOf(element(by.css(' .entity-card.mat-card'))),
      5000,
    );
  }

  cancelDialog() {
    element(by.css('.cdk-overlay-pane'))
      .isPresent()
      .then(() => {
        return element
          .all(by.css('.mat-button.mat-primary.ng-star-inserted'))
          .get(1)
          .click();
      });
  }

  confirmDialog() {
    element(by.css('.cdk-overlay-pane'))
      .isPresent()
      .then(() => {
        return element
          .all(by.css('.mat-button.mat-primary.ng-star-inserted'))
          .get(0)
          .click();
      });
  }

  waitDialog() {
    return browser.wait(
      protractor.ExpectedConditions.presenceOf(element(by.css('.cdk-overlay-pane'))),
      5000,
    );
  }

  getDialog() {
    return element(by.css('.cdk-overlay-pane'));
  }

  clickYesDialogButton() {
    element
      .all(by.css('.mat-button.mat-primary'))
      .last()
      .click();
  }

  getYesDialogButton() {
    return element.all(by.css('.mat-button.mat-primary')).last();
  }

  clickNoDialogButton() {
    element
      .all(by.css('.mat-button.mat-primary'))
      .first()
      .click();
    browser.waitForAngular();
  }

  waitDialogModal() {
    const EC = protractor.ExpectedConditions;
    browser.wait(
      EC.visibilityOf(element.all(by.tagName('mat-dialog-container')).last()),
      5000,
      'No Dialog Modal is loaded ',
    );
  }

  clickButtonbyText(text: string) {
    element(by.buttonText(text)).click();
  }

  clickButtonbyClass(classname: string) {
    element(by.css(`.${classname}`)).click();
  }

  waitUrlContains(expected: string) {
    return browser.wait(
      protractor.ExpectedConditions.urlContains(`${browser.baseUrl}/${expected}`),
      5000,
      `Url does not contain ${expected}`,
    );
  }

  buttonIsClickable(nameButton: string) {
    return element(by.buttonText(nameButton)).isEnabled();
  }

  waitRedirect(expected) {
    return browser.wait(
      protractor.ExpectedConditions.urlIs(`${browser.baseUrl}/${expected}`),
      5000,
      `Not redirected to ${expected}`,
    );
  }

  checkUrlToContain(expected) {
    return expect(browser.getCurrentUrl()).toContain(`${browser.baseUrl}/${expected}`);
  }

  generateID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }

  clickBell() {
    browser.wait(
      protractor.ExpectedConditions.elementToBeClickable(
        element(by.css('cs-notification-box button')),
      ),
    );
    element(by.css('cs-notification-box button')).click();
  }

  verifyBellMessage(text) {
    return element(by.cssContainingText('.message', text)).isPresent();
  }
}
