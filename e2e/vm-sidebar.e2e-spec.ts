///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
import { VMCreation } from './pages/vm-creation.po';
import { VMDeploy } from './pages/vm-deploy.po';
import { browser, by, element, protractor } from 'protractor';
import { VMList } from './pages/vm-list.po';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';

describe('e2e-test-vm-sidebar', () => {
  let deploy: VMDeploy;
  let login: Login;
  let vmlist: VMList;
  let sidebar: VMSidebar;

  beforeAll(() => {
    browser.driver
      .manage()
      .window()
      .maximize();
    login = new Login();
    login.navigateTo('/');
    login.login();
    login.waitRedirect('instances');
    sidebar = new VMSidebar();
  });

  beforeEach(() => {
    vmlist = new VMList();
    deploy = new VMDeploy();
  });

  it('Verify VM color is changed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickColorChange().then(color => {
      sidebar.clickClose();
      vmlist.getVMColor(0).then(vmcolor => {
        expect(vmcolor).toContain(color);
      });
    });
  });

  it('Verify description is changed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.setDescription('desc');
    sidebar.clickClose();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Description changed')).toBeTruthy();
  });

  it('Verify new group is set', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickEditGroup();
    sidebar.setNewGroupOption(sidebar.group);
    sidebar.clickSubmitGroupButton();
    sidebar.waitGroupChanged(sidebar.group);
    sidebar.clickClose();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Instance group changed')).toBeTruthy();
  });

  it('Verify existing group can be set', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickEditGroup();
    sidebar.setExistingGroupOption().then(group => {
      sidebar.clickSubmitGroupButton();
      sidebar.waitGroupChanged(group);
      expect(sidebar.getGroup()).toEqual(group);
    });
    sidebar.clickClose();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Instance group changed')).toBeTruthy();
  });

  it('Verify group with incorrect name can not be set', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickEditGroup();
    sidebar.setNewGroupOption('5214351538713');
    expect(sidebar.isEnabledSubmitGroupButton()).toBeFalsy(
      'Create button is enabled for incorrect group name',
    );
    sidebar.clickCancelGroupButton();
    browser.wait(
      protractor.ExpectedConditions.visibilityOf(element(by.css(`.open`))),
      2000,
      'No sidebar',
    );
    sidebar.clickClose();
  });

  it('Verify group is removed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickEditGroup();
    sidebar.setRemoveGroupOption();
    sidebar.clickSubmitGroupButton();
    sidebar.waitGroupChanged('Default group');
    sidebar.clickClose();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Instance group removed')).toBeTruthy('No bell message');
  });

  it('Change SO to fixed SO for running VM', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickChangeSO();
    sidebar.selectFixedTab();
    sidebar.changeSO();
    expect(sidebar.checkWarning()).toEqual('Virtual machine will be restarted');
    const temp = sidebar.getSelectedSO();
    sidebar.clickYesDialogButton();

    sidebar.isEnabledChangeSO();
    sidebar.isEnabledAddAffinityGroup();
    sidebar.isEnabledAddSSHKey();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('VM stopped')).toBeTruthy();
    expect(vmlist.verifyBellMessage('Service offering changed')).toBeTruthy();
    expect(vmlist.verifyBellMessage('VM started')).toBeTruthy();
    expect(sidebar.getChangedSOName()).toEqual(temp);
    sidebar.clickClose();
  });

  // custom SO for stopped VM

  it('Verify new affinity group is set', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickAddAffGroup();
    sidebar.setNewAffGroup(sidebar.aff);
    sidebar.waitDialogModal();
    sidebar.clickYesDialogButton();
    sidebar.waitAffGroupChanged(sidebar.aff);
    sidebar.clickClose();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Affinity group changed')).toBeTruthy(
      'Affinity group has not changed',
    );
  });

  it('Verify affinity group with incorrect name can not be create', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickAddAffGroup();
    sidebar.setAffGroupName('123');
    expect(sidebar.isEnabledCreateAffGroupButton()).toBeFalsy('Create Affinity button is enabled');
    sidebar.clickNoDialogButton();
    browser.wait(
      protractor.ExpectedConditions.visibilityOf(element(by.css(`.backdrop.ng-star-inserted`))),
      2000,
      'Sidebar is not opened',
    );
    sidebar.clickClose();
  });

  it('Verify existing affinity group can be create', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickAddAffGroup();
    sidebar.setAffGroupName(sidebar.aff);
    expect(sidebar.getErrorText()).toEqual('This name is taken');
    expect(sidebar.isEnabledCreateAffGroupButton()).toBeFalsy('Create Affinity button is enabled');
    sidebar.clickNoDialogButton();
    browser.wait(
      protractor.ExpectedConditions.visibilityOf(element(by.css(`.backdrop.ng-star-inserted`))),
      2000,
      'Sidebar is not opened',
    );
    sidebar.clickClose();
  });

  it('Verify new affinity group is set for stopped VM', () => {
    vmlist.clickOpenSidebarStopped();
    sidebar.clickAddAffGroup();
    sidebar.setNewAffGroup(sidebar.aff);
    sidebar.waitAffGroupChanged(sidebar.aff);
    sidebar.clickClose();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Affinity group changed')).toBeTruthy(
      'Affinity group has not changed',
    );
  });

  it('Remove a VM from the affinity group ', () => {
    vmlist.clickOpenSidebarRunning();
    browser
      .actions()
      .mouseMove(element(by.css('cs-affinity-group .row.ng-star-inserted')))
      .perform();
    sidebar.clickDeleteAffGroup();
    sidebar.waitDialog();
    sidebar.clickYesDialogButton();
    browser.wait(
      protractor.ExpectedConditions.presenceOf(
        element(by.xpath(`//cs-confirm-dialog//div[contains(text(),"stop")]`)),
      ),
      2000,
      'No notification about stopping VM',
    );
    sidebar.waitDialog();
    sidebar.clickYesDialogButton();

    sidebar.isEnabledChangeSO();
    sidebar.isEnabledAddAffinityGroup();
    sidebar.isEnabledAddSSHKey();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('VM stopped')).toBeTruthy();
    expect(vmlist.verifyBellMessage('Affinity group changed')).toBeTruthy();
    expect(vmlist.verifyBellMessage('VM started')).toBeTruthy();
    browser.wait(
      protractor.ExpectedConditions.presenceOf(
        element(by.xpath(`//cs-affinity-group//div[contains(text()," No affinity group ")]`)),
      ),
      2000,
      'List of affinity group not empty',
    );
    sidebar.clickClose();
  });

  it('Change SSH key of running VM', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickChangeSSHKey();
    sidebar.waitDialog();
    const temp = sidebar.selectSSHKey(1);
    sidebar.clickYesDialogButton();
    sidebar.waitDialog();
    expect(sidebar.checkResetWarning()).toBeTruthy('No warning message about reset VM');
    sidebar.clickYesDialogButton();

    sidebar.isEnabledChangeSO();
    sidebar.isEnabledAddAffinityGroup();
    sidebar.isEnabledAddSSHKey();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('VM stopped')).toBeTruthy();
    expect(vmlist.verifyBellMessage('SSH-key changed')).toBeTruthy();
    expect(vmlist.verifyBellMessage('VM started')).toBeTruthy();
    expect(sidebar.getSHHKey()).toEqual(temp);
    sidebar.clickClose();
  });
});
