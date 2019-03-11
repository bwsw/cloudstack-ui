import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class SGCreation extends CloudstackUiPage {
  name = `e2e${this.generateID()}`;
  description = `e2e${this.generateID()}`;

  buttonCreateSGEnabled() {
    return element(by.css('button[type=submit]')).isEnabled();
  }

  clickCreateSGButton() {
    element(by.css('button[type=submit]')).click();
  }

  setSGName(name) {
    element(by.name('name'))
      .click()
      .then(() => {
        element(by.name('name')).sendKeys(name);
      });
  }

  setSGDescription(description) {
    element(by.name('description'))
      .click()
      .then(() => {
        element(by.name('description')).sendKeys(description);
      });
  }

  clickADDRules() {
    element(by.css('.fancy-select-button.mat-button')).click(); // in "Create new template"/"Create new shared group"
  }

  getSaveRulesButton() {
    return element.all(by.css('button.mat-button')).last();
  }

  getTemplateName(index) {
    return element
      .all(by.css('.left-list h5'))
      .get(index)
      .getText();
  }

  getNetworkRules() {
    const rules = [];
    return element
      .all(by.css('cs-security-group-builder-rule h5.mat-line span'))
      .each(elem => {
        rules.push(elem.getText());
      })
      .then(() => {
        return Promise.all(rules);
      });
  }

  waitCreatingTemplate(name) {
    const EC = protractor.ExpectedConditions;
    browser.wait(
      EC.presenceOf(element(by.cssContainingText('.entity-card-title.mat-card-title span', name))),
      17000,
    );
  }

  verifyBuildNewSGModal() {
    expect(element(by.css('.left-list mat-list.mat-list.mat-list-base h5')).isPresent()).toBeTruthy(
      'All templates list should not be empty',
    );
    expect(element(by.css('.right-list mat-list.mat-list.mat-list-base h5')).isPresent()).toBeFalsy(
      'Selected templates" list should be empty',
    );
    expect(element(by.css('button.mat-button.ng-star-inserted')).isEnabled()).toBeTruthy(
      'Button Select all should be enabled',
    );

    element(by.css('button.mat-button.ng-star-inserted')).click(); // click "Select all"
    expect(element(by.css('.left-list mat-list.mat-list.mat-list-base h5')).isPresent()).toBeFalsy(
      'All templates list should be empty after click "Select all button',
    );
    expect(
      element(by.css('.rules-list mat-list.mat-list.mat-list-base h5')).isPresent(),
    ).toBeTruthy('Network rules list should not be empty after click Select all button');
    expect(
      element(by.css('.right-list mat-list.mat-list.mat-list-base h5')).isPresent(),
    ).toBeTruthy('Selected Templates list should not be empty after click Select all button');
    expect(element(by.css('.right-list button')).isEnabled()).toBeTruthy(
      'Button "Reset" should be enabled',
    );
    element(by.css('.right-list button')).click(); // click "Reset"

    expect(element(by.css('.right-list mat-list.mat-list.mat-list-base h5')).isPresent()).toBeFalsy(
      '"Selected Templates" list should be empty after click "Reset" button',
    );
    expect(element(by.css('.rules-list mat-list.mat-list.mat-list-base h5')).isPresent()).toBeFalsy(
      '"Network Rules" list should be empty after click "Reset" button',
    );
    expect(element(by.css('.left-list mat-list.mat-list.mat-list-base h5')).isPresent()).toBeTruthy(
      '"All templates" list should not be empty after click "Reset" button',
    );
  }

  selectTemplate(index) {
    element
      .all(by.css('.left-list h5'))
      .get(index)
      .getText()
      .then(name => {
        element
          .all(by.tagName('mat-list-item'))
          .get(index)
          .click();
        element(by.css('.mdi-chevron-right.mat-icon.mdi')).click(); // click "Right arrow" button
        expect(element(by.cssContainingText('.right-list h5', name)).isPresent()).toBeTruthy(
          'Selected element should be in "Selected templates" list',
        );
        expect(element(by.cssContainingText('.left-list h5', name)).isPresent()).toBeFalsy(
          'Selected element should not be in "All templates" list',
        );
        expect(
          element(by.css('.rules-list mat-list.mat-list.mat-list-base h5')).isPresent(),
        ).toBeTruthy(
          '"Network Rules" list should not be empty after added rule in "Selected templates" list',
        );
      });
  }
}
