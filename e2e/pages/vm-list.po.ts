import { CloudstackUiPage } from './app.po';
import { browser, by, element, ExpectedConditions, protractor } from 'protractor';

export class VMList extends CloudstackUiPage {
  EC = protractor.ExpectedConditions;

  getVMColor(index) {
    return element
      .all(by.tagName('cs-vm-list mat-card'))
      .get(index)
      .getAttribute('style');
  }

  getVMNameCard() {
    return element
      .all(by.css('.entity-card-title.mat-card-title'))
      .first()
      .element(by.tagName('span'))
      .getText();
  }

  getNameOfSpecificVm(VM) {
    return VM.element(by.css('.entity-card-title.mat-card-title'))
      .element(by.tagName('span'))
      .getText();
  }

  getVMByName(name) {
    return element(by.xpath(`.//span[text()="${name}"]/../../../..`));
  }

  getVMOSCard(index) {
    return element
      .all(by.css('.entity-card-data-line'))
      .get(2 * index)
      .getText();
  }

  getVMIPCard(index) {
    return element.all(by.css('.entity-card-data-line')).get(2 * index + 1);
  }

  clickCreateVM() {
    browser.wait(
      ExpectedConditions.elementToBeClickable(element(by.css('button.mat-fab.mat-accent'))),
      2000,
      'Create VM button is not clickable',
    );
    element(by.css('button.mat-fab.mat-accent')).click();
  }

  clickOpenSidebar(index) {
    const elem = element.all(by.css('cs-vm-list mat-card')).get(index);
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(this.EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenSidebarRunning() {
    const elem = element
      .all(by.xpath("//mat-icon[contains(@class,'running')]/ancestor::mat-card"))
      .first();
    browser.wait(this.EC.visibilityOf(elem), 5000);
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(this.EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenSidebarStopped() {
    const elem = element
      .all(by.xpath("//mat-icon[contains(@class,'stopped')]/ancestor::mat-card"))
      .first();
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(this.EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  inputSearchValue(value) {
    element(by.css('input.mat-input-element')).sendKeys(value);
  }

  checkAbsenceSearchResult() {
    expect(element(by.css('cs-vm-card-list-item')).isPresent()).toBeFalsy();
    expect(element(by.css('.no-results')).isPresent()).toBeTruthy();
  }

  checkSearchResult(value) {
    element.all(by.css('.entity-card-title.mat-card-title span')).each((elem, index) => {
      expect(elem.getText()).toContain(value);
    });
  }

  clearSearch() {
    element(by.css('input.mat-input-element')).clear();
    // 2 нижние строки - это костыль, т.к. VM list не обновляется если просто очистить поле
    this.inputSearchValue('a');
    browser
      .actions()
      .sendKeys(protractor.Key.BACK_SPACE)
      .perform();
  }

  clickOpenSidebarStopped() {
    const elem = element
      .all(by.xpath("//mat-icon[contains(@class,'stopped')]/ancestor::mat-card"))
      .first();
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(this.EC.visibilityOf(element(by.tagName('h4'))), 5000);
  }

  clickOpenAccessVM() {
    browser.wait(
      this.EC.elementToBeClickable(element(by.css('button.entity-card-menu.mat-icon-button'))),
      5000,
    );
    const elem = element.all(by.css('button.entity-card-menu.mat-icon-button')).first();
    browser
      .actions()
      .mouseMove(elem)
      .perform();
    browser
      .actions()
      .click()
      .perform();
    browser.wait(
      this.EC.visibilityOf(
        element(
          by.xpath(
            "//mat-icon[contains(@class,'mdi-laptop')]/ancestor::button[contains(@class,'mat-menu-item')]",
          ),
        ),
      ),
      2000,
      'No action menu items appear',
    );

    browser
      .actions()
      .mouseMove(
        element(
          by.xpath(
            "//mat-icon[contains(@class,'mdi-laptop')]/ancestor::button[contains(@class,'mat-menu-item')]",
          ),
        ),
      )
      .click()
      .perform();
    this.waitDialogModal();
    browser.wait(this.EC.visibilityOf(element(by.tagName('h3'))), 5000);
  }

  checkStateVm(state) {
    return element(by.css(`.mdi-circle.mat-icon.mdi.${state}`)).isPresent();
  }

  getStateRunning() {
    return element(by.css('.mdi-circle.mat-icon.mdi.running'));
  }

  getStateRunningByName(name) {
    return element(by.xpath(`.//span[text()="${name}"]/../../../..`)).element(
      by.css('.mdi-circle.mat-icon.mdi.running'),
    );
  }

  getStateStopped() {
    return element(by.css('.mdi-circle.mat-icon.mdi.stopped'));
  }

  getStateStoppedByName(name) {
    return element(by.xpath(`.//span[text()="${name}"]/../../../..`)).element(
      by.css('.mdi-circle.mat-icon.mdi.stopped'),
    );
  }

  getStateDestroyed(name) {
    return element(by.xpath(`.//span[text()="${name}"]/../../../..`)).element(
      by.css('.mdi-circle.mat-icon.mdi.destroyed'),
    );
  }

  getVMbyState(state) {
    return element(by.xpath(`//*[contains(@class, "mdi-circle mat-icon mdi ${state}")]/../../..`));
  }

  clickActionBoxbyVM(VM) {
    VM.element(by.css('.mdi-dots-vertical')).click();
  }

  clickActionBoxByName(name) {
    element(by.xpath(`.//span[text()="${name}"]/../../../..`))
      .element(by.css('.mdi-dots-vertical'))
      .click();
  }

  clickStartVM() {
    element(by.css('.mat-icon.mdi-play.mdi')).click();
  }

  clickStopVM() {
    element(by.css('.mat-icon.mdi-stop.mdi')).click();
  }

  clickRebootVM() {
    element(by.css('.mat-icon.mdi-replay.mdi')).click();
  }

  clickReinstallVM() {
    element(by.css('.mat-icon.mdi-backup-restore.mdi')).click();
  }

  clickDestroyVM() {
    element(by.css('.mat-icon.mdi-delete.mdi')).click();
  }

  clickRecoverVM() {
    element(by.css('.mat-icon.mdi-restore-clock.mdi')).click();
  }

  clickExpungeVM() {
    element(by.css('.mat-icon.mdi-delete-forever.mdi')).click();
  }

  selectFilter(filter, item) {
    if (filter === 'state') {
      element(by.css('mat-select[ng-reflect-placeholder="Select states"]')).click();
    }
    if (filter === 'zone') {
      element(by.css('mat-select[ng-reflect-placeholder="Select zones"]')).click();
    }
    if (filter === 'group_by') {
      element(by.css('cs-draggable-select[ng-reflect-placeholder="Group by"]')).click();
    }
    element(by.cssContainingText('.mat-option-text', item)).click();
    browser
      .actions()
      .sendKeys(protractor.Key.ESCAPE)
      .perform();
    const filterList = element(by.css('.mat-select-panel'));
    browser
      .wait(
        this.EC.not(this.EC.visibilityOf(filterList)),
        1000,
        `The selection panel has not disappeared`,
      )
      .then(() => {
        return true;
      });
  }

  getVmNameList() {
    const vms = element.all(by.css('.entity-card-title.mat-card-title span')).map((elm, index) => ({
      index,
      text: elm.getText(),
    }));
    return vms;
  }

  checkVmActionBox() {
    expect(element(by.css('.mat-icon.mdi-play.mdi')).isPresent()).toBeTruthy();
    expect(element(by.css('.mat-icon.mdi-stop.mdi')).isPresent()).toBeTruthy();
    expect(element(by.css('.mat-icon.mdi-replay.mdi')).isPresent()).toBeTruthy();
    expect(element(by.css('.mat-icon.mdi-backup-restore.mdi')).isPresent()).toBeTruthy();
    expect(element(by.css('.mat-icon.mdi-delete.mdi')).isPresent()).toBeTruthy();
    expect(element(by.css('.mat-icon.mdi-key.mdi')).isPresent()).toBeTruthy();
    expect(element(by.css('.mat-icon.mdi-laptop.mdi')).isPresent()).toBeTruthy();
  }

  checkEnabledForStoppedVM() {
    this.checkEnabledItemAcionBox('play');
    this.checkEnabledItemAcionBox('backup-restore');
    this.checkEnabledItemAcionBox('delete');
    this.checkDisabledItemActionBox('stop');
    this.checkDisabledItemActionBox('replay');
    // this.checkDisabledItemActionBox('key');
    this.checkDisabledItemActionBox('laptop');
  }

  checkEnabledForRunningVM() {
    this.checkEnabledItemAcionBox('stop');
    this.checkEnabledItemAcionBox('replay');
    this.checkEnabledItemAcionBox('backup-restore');
    this.checkEnabledItemAcionBox('delete');
    this.checkEnabledItemAcionBox('laptop');
    // this.checkDisabledItemActionBox('key');
    this.checkDisabledItemActionBox('play');
  }

  checkEnabledItemAcionBox(itemName) {
    return expect(
      element(
        by.xpath(
          `//*[contains(@class, "mat-icon mdi-${itemName} mdi")]/parent::button[contains(@class, "mat-menu-item")]`,
        ),
      ).isEnabled(),
    ).toBeTruthy(`Action box item "${itemName}" is not enabled`);
  }

  checkDisabledItemActionBox(itemName) {
    return expect(
      element(
        by.xpath(
          `//*[contains(@class, "mat-icon mdi-${itemName} mdi")]/parent::button[contains(@class, "mat-menu-item")]`,
        ),
      ).isEnabled(),
    ).toBeFalsy(`Action box item "${itemName}" is not disabled`);
  }
}
