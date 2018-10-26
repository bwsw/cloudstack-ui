import { browser, by, element, protractor } from 'protractor';

export class CloudstackUiPage {
  navigateTo() {
    return browser.get('/');
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
}
