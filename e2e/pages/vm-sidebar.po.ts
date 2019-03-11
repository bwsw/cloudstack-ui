import { browser, by, element, protractor } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class VMSidebar extends CloudstackUiPage {
  group = `e2e_group_${this.generateID()}`;
  aff = `aff_${this.generateID()}`;

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

  clickEditGroup() {
    const edit = element(by.css('cs-instance-group mat-icon.mdi-pencil.mat-icon.mdi'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(edit), 2000, 'No edit Group button').then(() => {
      edit.click();
      this.waitDialogModal();
    });
  }

  clickAddAffGroup() {
    const edit = element(by.css('cs-affinity-group mat-icon.mdi-plus.mat-icon.mdi'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(edit), 2000, 'No add Affinity group button').then(() => {
      edit.click();
      this.waitDialogModal();
    });
  }

  setNewAffGroup(name) {
    element(by.css('input[formControlName=name]')).sendKeys(name);
    element(by.css('.add-rule-button.mat-icon-button')).click();
    const EC = protractor.ExpectedConditions;
    browser.wait(
      EC.textToBePresentInElement(element(by.cssContainingText('.ng-star-inserted', name)), name),
      5000,
      'New affinity group was not added',
    );
    element(by.xpath(`//span[text()="${name}"]/ancestor::tr`)).click();
    element
      .all(by.css('.mat-button.mat-primary'))
      .last()
      .click();
  }

  setNewGroupOption(group) {
    element(by.cssContainingText('.mat-radio-label-content', 'Create a new group')).click();
    element(by.css('cs-create-update-delete-dialog input[name=textValue]'))
      .clear()
      .sendKeys(group);
  }

  isEnabledSubmitGroupButton() {
    return element(by.css('mat-dialog-container button[type=submit]')).isEnabled();
  }

  clickSubmitGroupButton() {
    element(by.css('mat-dialog-container button[type=submit]')).click();
  }

  clickCancelGroupButton() {
    element(by.css('mat-dialog-container button[type=button]')).click();
  }

  setExistingGroupOption() {
    element(by.name('selectValue')).click();
    const group = element(by.css('mat-option[aria-selected=false] span.mat-option-text'));
    const groupText = group.getText();
    group.click();
    return groupText;
  }

  setRemoveGroupOption() {
    element(by.cssContainingText('.mat-radio-label-content', 'Remove from the group')).click();
  }

  waitGroupChanged(group) {
    const EC = protractor.ExpectedConditions;
    browser.wait(
      EC.textToBePresentInElement(element(by.css('cs-instance-group div.ng-star-inserted')), group),
      5000,
      'Group name is not changed in sidebar VM',
    );
  }

  waitAffGroupChanged(aff) {
    const EC = protractor.ExpectedConditions;
    browser.wait(
      EC.presenceOf(element(by.xpath(`//cs-affinity-group//span[text()="${aff}"]`))),
      5000,
      'Group name is not changed in sidebar VM',
    );
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
