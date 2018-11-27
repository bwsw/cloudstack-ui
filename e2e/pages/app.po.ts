import { browser, by, element, protractor } from 'protractor';

export class CloudstackUiPage {
  navigateTo(path) {
    return browser.get(path);
  }

  clickFirewallMenu() {
    element(by.css('.mat-icon.mdi-security.mdi')).click();
  }

  clickVMMenu() {
    element(by.css('.mat-icon.mdi-cloud.mdi')).click();
  }

  waitDialogModal() {
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element.all(by.tagName('mat-dialog-container')).last()), 5000);
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
    );
  }

  buttonIsClickable(nameButton: string) {
    return element(by.buttonText(nameButton)).isEnabled();
  }

  waitRedirect(expected) {
    return browser.wait(
      protractor.ExpectedConditions.urlIs(`${browser.baseUrl}/${expected}`),
      5000,
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
}
