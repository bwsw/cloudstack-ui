///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
import { VMCreation } from './pages/vm-creation.po';
import { VMDeploy } from './pages/vm-deploy.po';
import { browser, by, element, protractor } from 'protractor';
import { VMList } from './pages/vm-list.po';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';
import { SSHList } from './pages/ssh-list.po';

describe('e2e-test-vm-sidebar', () => {
  let deploy: VMDeploy;
  let login: Login;
  let vmlist: VMList;
  let sidebar: VMSidebar;
  let sshlist: SSHList;

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
    sshlist = new SSHList();
  });

  afterAll(() => {
    login.logout();
  });

  it('Verify VM color is changed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickColorChange().then(color => {
      sidebar.clickCloseSidebar();
      vmlist.getVMColor(0).then(vmcolor => {
        expect(vmcolor).toContain(color);
      });
    });
  });

  it('Verify description is changed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.setDescription('desc');

    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Description changed')).toBeTruthy();
    sidebar.clickCloseSidebar();
  });

  it('Verify new group is set', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickEditGroup();
    sidebar.setNewGroupOption(sidebar.group);
    sidebar.clickSubmitGroupButton();
    sidebar.waitGroupChanged(sidebar.group);

    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Instance group changed')).toBeTruthy();
    sidebar.clickCloseSidebar();
  });

  it('Verify existing group can be set', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickEditGroup();
    sidebar.setExistingGroupOption().then(group => {
      sidebar.clickSubmitGroupButton();
      sidebar.waitGroupChanged(group);
      expect(sidebar.getGroup()).toEqual(group);
    });

    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Instance group changed')).toBeTruthy();
    sidebar.clickCloseSidebar();
  });

  it('Verify group with incorrect name can not be set', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickEditGroup();
    sidebar.setNewGroupOption('5214351538713');
    expect(sidebar.isEnabledSubmitGroupButton()).toBeFalsy(
      'Create button is enabled for incorrect group name',
    );
    sidebar.clickCancelGroupButton();
    sidebar.waitSidebar();
    sidebar.clickCloseSidebar();
  });

  it('Verify group is removed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickEditGroup();
    sidebar.setRemoveGroupOption();
    sidebar.clickSubmitGroupButton();
    sidebar.waitGroupChanged('Default group');

    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Instance group removed')).toBeTruthy('No bell message');
    sidebar.clickCloseSidebar();
  });

  it('Change SO to fixed SO for running VM', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickChangeSO();
    const temp = sidebar.selectFixedSO();

    sidebar.isEnabledChangeSO();
    sidebar.isEnabledAddAffinityGroup();
    sidebar.isEnabledAddSSHKey();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('VM stopped')).toBeTruthy();
    expect(vmlist.verifyBellMessage('Service offering changed')).toBeTruthy();
    expect(vmlist.verifyBellMessage('VM started')).toBeTruthy();
    expect(sidebar.getChangedSOName()).toEqual(temp);
    sidebar.clickCloseSidebar();
  });

  it('Verify new affinity group is set', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickAddAffGroup();
    sidebar.setNewAffGroup(sidebar.aff);
    sidebar.waitDialogModal();
    sidebar.clickYesDialogButton();
    sidebar.waitAffGroupChanged(sidebar.aff);

    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Affinity group changed')).toBeTruthy(
      'Affinity group has not changed',
    );
    sidebar.clickCloseSidebar();
  });

  it('Verify affinity group with incorrect name can not be create', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickAddAffGroup();
    sidebar.setAffGroupName('123');
    expect(sidebar.isEnabledCreateAffGroupButton()).toBeFalsy('Create Affinity button is enabled');
    sidebar.clickNoDialogButton();
    sidebar.waitSidebar();
    sidebar.clickCloseSidebar();
  });

  it('Verify existing affinity group can not be create', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickAddAffGroup();
    sidebar.setAffGroupName(sidebar.aff);
    expect(sidebar.getErrorText()).toEqual('This name is taken');
    expect(sidebar.isEnabledCreateAffGroupButton()).toBeFalsy('Create Affinity button is enabled');
    sidebar.clickNoDialogButton();
    sidebar.waitSidebar();
    sidebar.clickCloseSidebar();
  });

  it('Verify new affinity group is set for stopped VM', () => {
    vmlist.clickOpenSidebarStopped();
    sidebar.clickAddAffGroup();
    sidebar.setNewAffGroup(sidebar.aff);
    sidebar.waitAffGroupChanged(sidebar.aff);

    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Affinity group changed')).toBeTruthy(
      'Affinity group has not changed',
    );
    sidebar.clickCloseSidebar();
  });

  it('Remove a VM from the affinity group ', () => {
    vmlist.clickOpenSidebarRunning();
    sidebar.clickDeleteAffGroup(sidebar.aff);
    sidebar.checkResetWarningMessage();
    sidebar.clickYesDialogButton();

    sidebar.isEnabledChangeSO();
    sidebar.isEnabledAddAffinityGroup();
    sidebar.isEnabledAddSSHKey();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('VM stopped')).toBeTruthy();
    expect(vmlist.verifyBellMessage('Affinity group changed')).toBeTruthy();
    expect(vmlist.verifyBellMessage('VM started')).toBeTruthy();

    expect(sidebar.getNoAffGroup(sidebar.aff)).toBeFalsy('Affinity is not deleted');
    sidebar.clickCloseSidebar();
  });

  it('Change SSH key of running VM', () => {
    vmlist.clickSSHMenu();
    sshlist.clickCreateSSH(sshlist.sshname);
    vmlist.clickVMMenu();
    vmlist.clickOpenSidebarRunning();
    const temp = sidebar.changeSSHKey();
    expect(sidebar.checkResetWarningMessage()).toBeTruthy('No warning message about reset VM');
    sidebar.checkResetWarningMessage();
    sidebar.clickYesDialogButton();

    sidebar.isEnabledChangeSO();
    sidebar.isEnabledAddAffinityGroup();
    sidebar.isEnabledAddSSHKey();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('VM stopped')).toBeTruthy();
    expect(vmlist.verifyBellMessage('SSH-key changed')).toBeTruthy();
    expect(vmlist.verifyBellMessage('VM started')).toBeTruthy();
    expect(sidebar.getSHHKey()).toEqual(temp);
    sidebar.clickCloseSidebar();
  });
});
