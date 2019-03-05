import { browser, by, element, protractor } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class VMSidebar extends CloudstackUiPage {
  clickColorChange() {
    element(by.css('.color-preview-container')).click();
    const color = element
      .all(by.css('.color.ng-star-inserted'))
      .first()
      .click();
    return element(by.css('div.color-preview.ng-star-inserted')).getAttribute('style');
  }

  setDescription(text) {
    element(by.tagName('cs-inline-edit')).click();
    element(by.css('cs-description mat-icon.mdi-pencil.mat-icon.mdi'))
      .isPresent()
      .then(() => {
        element(by.css('cs-description mat-icon.mdi-pencil.mat-icon.mdi')).click();
      });
    element(by.tagName('textarea'))
      .clear()
      .sendKeys(text);
    element(by.css('cs-description button[type=submit]')).click();
    expect(element(by.css('cs-description span.text-content')).getText()).toEqual(text);
  }

  getVMName() {
    return element(by.tagName('h4')).getText();
  }

  setGroup(text) {
    const edit = element(by.css('cs-instance-group mat-icon.mdi-pencil.mat-icon.mdi'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(edit), 2000, 'No edit Group button').then(() => {
      edit.click();
      this.waitDialogModal();
      element(by.cssContainingText('.mat-radio-label-content', 'Create a new group')).click();
      element(by.css('cs-create-update-delete-dialog input[name=textValue]'))
        .clear()
        .sendKeys(text);
      element(by.css('mat-dialog-container button[type=submit]')).click();
      browser.waitForAngular();
      expect(element(by.css('cs-instance-group div.ng-star-inserted')).getText()).toEqual(text);
    });
  }

  getGroup() {
    return element(by.tagName('cs-instance-group'))
      .element(by.css('.mat-card-content-container'))
      .element(by.tagName('div'))
      .getText();
  }

  getSOName() {
    return element(by.tagName('cs-service-offering-details'))
      .element(by.css('.grid.service-offering.mat-card-content-container'))
      .element(by.tagName('div'))
      .all(by.tagName('div'))
      .last()
      .getText();
  }

  getTemplate() {
    return element(by.tagName('cs-vm-detail-template'))
      .element(by.css('.mat-card-content'))
      .element(by.tagName('div'))
      .getText();
  }

  getAffGroup() {
    return element(by.tagName('cs-affinity-group'))
      .element(by.css('.mat-card-content-container'))
      .element(by.css('.key.ng-star-inserted'))
      .getText();
  }

  clickClose() {
    element(by.css('.backdrop.ng-star-inserted')).click();
  }

  clickTagTab() {
    element
      .all(by.css('.mat-tab-link'))
      .last()
      .click();
  }

  deleteTag() {
    // element(by.css('.mdi-delete.mat-icon.mdi')).click();
  }

  getTagKey(expected) {
    return element(by.css('.mat-card-content-container')).element(
      by.cssContainingText('.key', expected),
    );
  }

  getTagValue(expected) {
    return element(by.css('.mat-card-content-container')).element(
      by.cssContainingText('.value', expected),
    );
  }
}
