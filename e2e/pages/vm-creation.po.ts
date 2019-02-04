import { by, element, protractor, browser } from 'protractor';
import { CloudstackUiPage } from './app.po';

export class VMCreation extends CloudstackUiPage {
  name = `e2e${this.generateID()}`;
  group = `e2e_group_${this.generateID()}`;
  ssh = 'No SSH key';
  aff = `e2e_aff_group_${this.generateID()}`;

  clickVMSection() {
    const linkactive = element(by.css('a[ng-reflect-router-link-active=link-active]'));
    return linkactive.element(by.css('.mat-icon.mdi-cloud.mdi')).click();
  }

  clickSelectInstSource() {
    element(by.name('template'))
      .element(by.tagName('button'))
      .click();
  }

  getSelectedTemplate() {
    return element(by.css('.mat-radio-button.mat-accent.mat-radio-checked'));
  }

  getInstSourceText() {
    return element(by.name('template'))
      .element(by.css('.template-info.truncate.ng-star-inserted'))
      .getText();
  }

  setDisplayName(name) {
    const input1 = element(by.name('displayName'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(input1), 2000, 'No display name').then(() => {
      input1.sendKeys(name);
      browser.wait(EC.textToBePresentInElementValue(element(by.name('displayName')), name));
      expect(input1.getAttribute('value')).toBe(name);
    });
  }

  setHostName(name) {
    const input1 = element(by.name('hostName'));
    input1.sendKeys(name);
    expect(input1.getAttribute('value')).toBe(name);
    browser.wait(
      protractor.ExpectedConditions.textToBePresentInElementValue(
        element(by.name('hostName')),
        name,
      ),
    );
    expect(input1.getAttribute('value')).toBe(name);
  }

  getZone() {
    return element(by.name('zone'))
      .all(by.tagName('span'))
      .last()
      .getText();
  }

  getSO() {
    return element(by.name('serviceOffering'))
      .element(by.css('.service-offering-info.truncate.ng-star-inserted'))
      .getText();
  }

  getDiskSize() {
    return element(by.css('.current-value'))
      .element(
        by.css(
          '.mat-input-element.mat-form-field-autofill-control.cdk-text-field-autofill-monitored.ng-untouched.ng-pristine.ng-valid',
        ),
      )
      .getAttribute('value');
  }

  clickAdvancedTab() {
    element
      .all(by.css('.mat-tab-label.mat-ripple.ng-star-inserted'))
      .last()
      .click();
    const EC = protractor.ExpectedConditions;
    const group = EC.visibilityOf(element(by.name('instanceGroup')));
    const start = EC.visibilityOf(element(by.name('startVm')));
    const sg = EC.visibilityOf(element(by.name('sgm')));
    const ssh = EC.visibilityOf(element(by.name('ssh')));
    const host = EC.visibilityOf(element(by.name('hostName')));
    browser.wait(EC.and(group, start, sg, ssh, host), 5000, 'Advanced tab does not open');
  }

  setGroupName(name) {
    element(by.name('instanceGroup')).sendKeys(name);
  }

  getGroupName() {
    return element(by.name('instanceGroup')).getAttribute('value');
  }

  setAffGroupName(name: string) {
    element(by.css('.fancy-select-button.mat-button')).click();
    this.waitDialogModal();
    element(by.css('input[formControlName=name]')).sendKeys(name);
    element(by.css('.add-rule-button.mat-icon-button')).click();
    const EC = protractor.ExpectedConditions;
    browser.wait(
      EC.textToBePresentInElement(element(by.cssContainingText('.ng-star-inserted', name)), name),
      5000,
    );
    // Can't find aff created element. so choose last
    // element (by.css(".mat-row.ng-star-inserted")). element(by.cssContainingText('.ng-star-inserted', name)).click();
    element
      .all(by.css('.mat-row.ng-star-inserted'))
      .get(1)
      .click();
    element
      .all(by.css('.mat-button.mat-primary'))
      .last()
      .click();
    browser.wait(
      EC.textToBePresentInElement(
        element(by.tagName('cs-vm-creation-affinity-group-manager')).element(
          by.css('.name-container.ng-star-inserted'),
        ),
        'anti-affinity',
      ),
      5000,
    );
  }

  setPrivateSG() {
    element
      .all(by.css('.fancy-select-button.mat-button'))
      .last()
      .click();
    this.waitDialogModal();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.css('.mat-button-toggle-label-content'))));
    element(by.cssContainingText('.mat-button-toggle-label-content', ' Create new ')).click();
    // element.all (by.css('.mat-button-toggle-button')).first().click();

    browser.wait(EC.visibilityOf(element(by.tagName('mat-list-item'))), 3000);
    element(by.tagName('mat-list-item')).click();
    element(by.css('.mdi-chevron-right.mat-icon.mdi')).click();
    element
      .all(by.css('.mat-button.mat-primary'))
      .last()
      .click();
    browser.wait(
      EC.textToBePresentInElement(
        element(by.name('sgm')).element(by.css('.ellipsis-overflow.ng-star-inserted')),
        'Based on TCP Permit All',
      ),
      5000,
    );
  }

  setDefaultSGRule() {
    element
      .all(by.css('.fancy-select-button.mat-button'))
      .last()
      .click();
    this.waitDialogModal();
    element
      .all(by.css('.mat-button-toggle-button'))
      .last()
      .click();
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(element(by.tagName('mat-list-item'))), 3000);
    element(by.tagName('mat-list-item')).click();
    element
      .all(by.css('.mat-button.mat-primary'))
      .last()
      .click();
    browser.wait(
      EC.textToBePresentInElement(
        element(by.name('sgm')).element(by.css('.ellipsis-overflow.ng-star-inserted')),
        'default',
      ),
      5000,
    );
  }

  getAffGroupName() {
    return element(by.css('.mat-form-field-wrapper.template-list')).getText();
  }

  getSSHkey() {
    return element(by.name('ssh'))
      .all(by.tagName('span'))
      .last()
      .getText();
  }

  getStartVM() {
    return element(by.name('startVm'));
  }

  setStartVM() {
    element(by.name('startVm')).click();
  }

  getSelectedRules() {
    return element(by.name('sgm'))
      .element(by.css('.ellipsis-overflow.ng-star-inserted'))
      .getText();
  }

  getErrorHostName() {
    return element(by.cssContainingText('.mat-error.ng-star-inserted', 'This name is taken'));
  }
}
