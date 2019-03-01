import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';
import { el } from '@angular/platform-browser/testing/src/browser_util';

export class SGCreation extends CloudstackUiPage {
  name = `e2e${this.generateID()}`;
  description = `e2e${this.generateID()}`;
  group = `e2e_group_${this.generateID()}`;
  ssh = 'No SSH key';
  aff = `e2e_aff_group_${this.generateID()}`;

  buttonCreateIsEnabled() {
    return;
    element.all(by.css('button[type=submit]')).isEnabled();
    // element.all(by.cssContainingText('.mat-dialog-actions.mat-button.mat-primary', 'Create')).isEnabled();
  }

  clickCreateButton() {
    element.all(by.css('button[type=submit]')).click();
  }

  setSGName(name) {
    // in "Create new template"/"Create new shared group"
    const inputName = element(by.name('name'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(inputName), 2000, 'No display name').then(() => {
      inputName.sendKeys(name);
      browser.wait(EC.textToBePresentInElementValue(element(by.name('name')), name));
      expect(inputName.getAttribute('value')).toBe(name);
    });
  }

  setSGDescription(description) {
    // in "Create new template"/"Create new shared group"
    const input1 = element(by.name('description'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(input1), 2000, 'No display description').then(() => {
      input1.sendKeys(description);
      browser.wait(EC.textToBePresentInElementValue(element(by.name('description')), description));
      expect(input1.getAttribute('value')).toBe(description);
    });
  }

  clickADDbutton() {
    element(by.css('.fancy-select-button.mat-button')).click(); // in "Create new template"/"Create new shared group"
  }

  getSaveButton() {
    return element.all(by.css('button.mat-button')).last();
  }

  checkListNotEmpty(designation) {
    return;
    element(by.css(designation))
      .all(element(by.css('mat-list.mat-list.mat-list-base.ng-star-inserted')))
      .isPresent();
  }

  getTemplateName(index) {
    return element
      .all(by.css('.left-list h5'))
      .get(index)
      .getText();
  }

  takeRulesText() {
    return element.all(by.css('cs-security-group-builder-rule span')).getText();
    /* let rules;
     element.all(by.css('cs-security-group-builder-rule span')).each( (elem) => {
      elem.getText().then( (text) => {
      rules += text;
      });
    });
     return rules;*/
  }

  verifyBuildNewSGModal() {
    expect(this.checkListNotEmpty('.left-list')).toBeFalsy(
      '"All templates" list should not be empty',
    );
    expect(this.checkListNotEmpty('.right-list')).toBeFalsy(
      '"Selected templates" list should be empty',
    );
    expect(element(by.css('.left-list.mat-button ng-star-inserted')).isEnabled).toBeTruthy(
      'Button "Select all" should be enabled',
    );
    element(by.css('.left-list button')).click(); // click "Select all"
    expect(this.checkListNotEmpty('.left-list')).toBeFalsy(
      '"All templates" list should be empty after click "Select all" button',
    );
    expect(this.checkListNotEmpty('.rules-list')).toBeTruthy(
      '"Network rules" list should not be empty after click "Select all" button',
    );
    expect(this.checkListNotEmpty('.right-list')).toBeTruthy(
      '"Selected Templates" list should not be empty after click "Select all" button',
    );
    expect(element(by.css('.right-list.mat-button ng-star-inserted')).isEnabled).toBeTruthy(
      'Button "Reset" should be enabled',
    );
    element(by.css('.right-list button')).click(); // click "Reset"
    expect(this.checkListNotEmpty('.right-list')).toBeFalsy(
      '"Selected Templates" list should be empty after click "Reset" button',
    );
    expect(this.checkListNotEmpty('.rules-list')).toBeFalsy(
      '"Network Rules" list should be empty after click "Reset" button',
    );
    expect(this.checkListNotEmpty('.left-list')).toBeTruthy(
      '"All templates" list should not be empty after click "Reset" button',
    );
    this.selectTemplate(0);
    expect(this.getSaveButton().isEnabled()).toBeTruthy('Button "Save" should be enabled');
    this.getSaveButton().click();
  }

  selectTemplate(index) {
    // проверить корректное перемещение элемента из правого списка в левый
    browser.sleep(2000);

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
        //  expect(this.checkListNotEmpty('.rules-list')).toBeTruthy('"Network Rules" list should not be empty after added rule in "Selected templates" list');
      });
  }

  // getSelectedTemplateName(index) {
  //   return element(by.css('.right-list'))
  //     .all(by.css('.mat-list.mat-list-base'))
  //     .get(index)
  //     .getText();
  // }

  // selectItemFromList(index, designation) {
  //   // in "Build a new security group" modal
  //   element(by.css(designation))
  //     .all(by.css('.mat-list.mat-list-base'))
  //     .get(index)
  //     .click();
  // }

  // getSGItemsFromRightList() {  // in "Build a new security group" modal
  //   return element
  //     .all(by.css('.right-list'))
  //     .all(by.css('.mat-line'))
  //     .element(by.tagName('h5'))
  //     .getText();
  // }

  // getItemNameFromRightList () {
  //   return
  //   element(by.css('.right-list'))
  //     .first()
  //     .element(by.css('.mat-list-item ng-star-inserted'))
  //     .element(by.css('mat-line'))
  //     .getText()
  // }

  // getSGItemsFromLeftList() {  // in "Build a new security group" modal
  //   return element
  //     .all(by.css('.left-list'))
  //     .all(by.css('.mat-line'))
  //     .element(by.tagName('h5'))
  //     .getText();
  // }

  // getSGNetworkRulesList () {
  //   return element
  //     .all(by.css('.mat-list mat-list-base'))
  //     .all(by.css('.mat-line'))
  //     .element(by.tagName('h5'))
  //     .getText();
  // }
}
