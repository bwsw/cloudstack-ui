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
    element(by.css('button[type=submit]')).isEnabled();
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
    element(by.css('.top-row'))
      .element(by.css('.fancy-select-button.mat-button'))
      .click(); // in "Create new template"/"Create new shared group"
  }

  clickSelectAllButton() {
    element(by.css('.left-list'))
      .element(by.css('.mat-button.ng-star-inserted'))
      .click();
  }

  clickResetButton() {
    element(by.css('.right-list'))
      .element(by.css('.mat-button.ng-star-inserted'))
      .click();
  }

  clickCancelButton() {
    element
      .all(by.css('.mat-dialog-actions'))
      .first()
      .click();
  }

  clickSaveButton() {
    element
      .all(by.css('.mat-dialog-actions'))
      .last()
      .click();
  }

  checkSelectedTemplatesNotEmpty() {
    return;
    element(by.css('.right-list.mat-list-item.ng-star-inserted')).isPresent();
  }

  checkAllTemplatesNotEmpty() {
    return;
    element(by.css('.right-list'))
      .element(by.css('.mat-list-item.ng-star-inserted'))
      .isPresent();
  }

  checkNetworkRulesNotEmpty() {
    return;
    element(by.css('rules-list'))
      .all(element(by.css('.mat-list.mat-list-base.ng-star-inserted')))
      .isPresent();
  }

  // in "Build a new security group" modal
  clickSGRightArrow() {
    element(by.css('.mdi-chevron-right.mat-icon mdi')).click();
  }
  // in "Build a new security group" modal
  clickSGLeftArrow() {
    element(by.css('.mdi-chevron-left.mat-icon mdi')).click();
  }
  selectSGFirstItemFromRightList() {
    // in "Build a new security group" modal
    element(by.css('.right-list'))
      .all(by.css('.mat-list.mat-list-base'))
      .first()
      .click();
  }

  getTemplateName(index) {
    return element
      .all(by.css('.left-list h5'))
      .get(index)
      .getText();
  }

  getSelectedTemplateName(index) {
    return element(by.css('.right-list'))
      .all(by.css('.mat-list.mat-list-base'))
      .get(index)
      .getText();
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
        this.clickSGRightArrow();
        expect(element(by.cssContainingText('.right-list h5', name)).isPresent()).toBeTruthy();
        expect(element(by.cssContainingText('.left-list h5', name)).isPresent()).toBeFalsy();
      });
  }

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
