import { by, element, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class VMSidebar extends CloudstackUiPage {
  group = `e2e_group_${this.generateID()}`;
  aff = `aff_${this.generateID()}`;
  EC = browser.ExpectedConditions;

  clickColorChange() {
    const elem = element(by.css('.color-preview-container'));
    browser.wait(this.EC.elementToBeClickable(elem), 2000, 'No edit Group button');
    elem.click();
    const color = element
      .all(by.css('.color.ng-star-inserted'))
      .first()
      .click();
    return element(by.css('div.color-preview.ng-star-inserted')).getAttribute('style');
  }

  setDescription(text) {
    element(by.css('cs-inline-edit span.text-content')).click();
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
    browser.wait(this.EC.elementToBeClickable(edit), 2000, 'No edit Group button').then(() => {
      edit.click();
      this.waitDialogModal();
    });
  }

  clickAddAffGroup() {
    const edit = element(by.css('cs-affinity-group mat-icon.mdi-plus.mat-icon.mdi'));
    browser
      .wait(this.EC.elementToBeClickable(edit), 2000, 'No add Affinity group button')
      .then(() => {
        edit.click();
        this.waitDialogModal();
      });
  }

  setNewAffGroup(name) {
    element(by.css('input[formControlName=name]')).sendKeys(name);
    element(by.css('.add-rule-button.mat-icon-button')).click();
    browser.wait(
      this.EC.textToBePresentInElement(
        element(by.cssContainingText('cs-vm-details-affinity-group-list', name)),
        name,
      ),
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
    browser.wait(
      this.EC.textToBePresentInElement(
        element(by.css('cs-instance-group div.ng-star-inserted')),
        group,
      ),
      5000,
      'Group name is not changed in sidebar VM',
    );
  }

  waitAffGroupChanged(aff) {
    browser.wait(
      this.EC.presenceOf(element(by.xpath(`//cs-affinity-group//span[text()="${aff}"]`))),
      5000,
      'Affinity group name is not changed in sidebar VM',
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
    return element(by.css('cs-tag-category div.mat-card-content-container')).element(
      by.cssContainingText('.key', expected),
    );
  }

  getTagValue(expected) {
    return element(by.css('cs-tag-category div.mat-card-content-container')).element(
      by.cssContainingText('.value', expected),
    );
  }

  clickChangeSO() {
    const elem = element.all(by.css('cs-service-offering-details .mat-icon-button')).first();
    browser.wait(this.EC.elementToBeClickable(elem), 2000, 'No edit Group button');
    elem.click();
  }

  selectFixedSO() {
    element
      .all(by.css('cs-service-offering-dialog-container mat-button-toggle-group mat-button-toggle'))
      .first()
      .click();
    element(
      by.xpath(
        "//mat-radio-button[@class='mat-radio-button mat-accent mat-radio-checked']/ancestor::tbody//mat-radio-button[@class='mat-radio-button mat-accent']",
      ),
    ).click();
    const elem = element(by.css('.message.warning.ng-star-inserted')).getText();
    expect(elem).toEqual('Virtual machine will be restarted');
    const temp = element(
      by.xpath(
        "//mat-radio-button[@class='mat-radio-button mat-accent mat-radio-checked']/ancestor::td/preceding-sibling::td//span",
      ),
    ).getText();
    this.clickYesDialogButton();
    return temp;
  }

  getChangedSOName() {
    return element(
      by.xpath(`//cs-service-offering-details//div[text()="Name"]/following-sibling::div`),
    ).getText();
  }

  isEnabledChangeSO() {
    expect(
      element(by.css('cs-service-offering-details button[ng-reflect-disabled=true]')),
    ).toBeTruthy('Change SO button is enabled');
  }

  isEnabledAddAffinityGroup() {
    expect(element(by.css('cs-affinity-group button[ng-reflect-disabled=true]'))).toBeTruthy(
      'Affinity group button is enabled',
    );
  }

  isEnabledAddSSHKey() {
    expect(element(by.css('cs-vm-ssh-keypair button[ng-reflect-disabled=true]'))).toBeTruthy(
      'Add SHH Key is enabled',
    );
  }

  changeSSHKey() {
    browser.wait(
      this.EC.elementToBeClickable(element(by.css('cs-vm-ssh-keypair button'))),
      2000,
      'Button is not clickable',
    );
    element(by.css('cs-vm-ssh-keypair button')).click();
    this.waitDialogModal();
    this.waitDialog();
    const temp = this.selectSSHKey(0);
    this.clickYesDialogButton();
    this.waitDialog();
    return temp;
  }

  selectSSHKey(index) {
    element(by.css('cs-ssh-keypair-reset mat-select')).click();
    element
      .all(by.css('mat-option'))
      .get(index)
      .click();
    return element
      .all(by.css('mat-option span'))
      .get(index)
      .getText();
  }

  getSHHKey() {
    return element(by.css('cs-vm-ssh-keypair .mat-card-content-container span')).getText();
  }

  checkResetWarningMessage() {
    this.waitDialog();
    return browser.wait(
      this.EC.presenceOf(element(by.xpath(`//cs-confirm-dialog//div[contains(text(),"stop")]`))),
      2000,
      'No notification about stopping VM',
    );
  }

  isEnabledCreateAffGroupButton() {
    return element(by.css('.add-rule-button.mat-icon-button')).isEnabled();
  }

  getErrorText() {
    element(by.css('cs-affinity-group-selector mat-card-header')).click();
    browser.wait(
      this.EC.presenceOf(element(by.css('.mat-error.ng-star-inserted'))),
      5000,
      'Error message is not present',
    );
    return element(by.css('.mat-error.ng-star-inserted')).getText();
  }

  clickDeleteAffGroup(aff) {
    browser
      .actions()
      .mouseMove(element(by.xpath(`//cs-affinity-group//span[text()="${aff}"]`)))
      .perform();
    browser
      .actions()
      .mouseMove(
        element(by.xpath(`//cs-affinity-group//span[text()="${aff}"]/following-sibling::button`)),
      )
      .perform();
    browser
      .actions()
      .click()
      .perform();
    this.waitDialog();
    this.clickYesDialogButton();
  }

  getNoAffGroup(aff) {
    return element(by.xpath(`//cs-confirm-dialog//div[contains(text(),"${aff}")]`)).isPresent();
  }

  setAffGroupName(name) {
    element(by.css('input[formControlName=name]')).sendKeys(name);
  }

  waitSidebar() {
    browser.wait(this.EC.presenceOf(element(by.css('.open'))), 5000, 'Sidebar is not opened');
  }
}
