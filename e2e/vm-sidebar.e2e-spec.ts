///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
import { VMCreation } from './pages/vm-creation.po';
import { VMDeploy } from './pages/vm-deploy.po';
import { browser, by, element, protractor } from 'protractor';
import { VMList } from './pages/vm-list.po';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';
import { SSHList } from './pages/ssh-list.po';
import { DiskCreation } from './pages/disk-creation.po';
import { DiskList } from './pages/disk-list.po';

describe('e2e-test-vm-sidebar', () => {
  let deploy: VMDeploy;
  let login: Login;
  let vmlist: VMList;
  let sidebar: VMSidebar;
  let sshlist: SSHList;
  let diskcreation: DiskCreation;
  let disklist: DiskList;

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
    login.navigateTo('/instances');
    login.waitRedirect('instances');
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
  /* Test needs to be fixed
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
  */
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
  /* Test needs to be fixed
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
  */
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
  /* Not working in headless mode
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
  */
  it('Create new volume from vm sidebar', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickStorageTab();
    sidebar.clickCreateNewVolume();
    expect(browser.getCurrentUrl()).toContain('/storage/create');
    diskcreation = new DiskCreation();
    diskcreation.waitDialogModal();
    diskcreation.setName(diskcreation.diskfixed);
    diskcreation.setZone();
    diskcreation.selectFixedDO();
    diskcreation.waitDialogModal();
    diskcreation.clickYesDialogButton();
    login.navigateTo('/instances');
    login.waitRedirect('instances');
  });

  it('Attach an existing volume to VM', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickStorageTab();
    sidebar.clickAttachVolume();
    sidebar.selectVolume();
    sidebar.getVolumeName().then(name => {
      sidebar.clickYesDialogButton();
      sidebar.clickAttachVolume();
      sidebar.clickBell();
      sidebar.waitBellMessage('Volume attached');
      sidebar.verifyBellMessage('Volume attached');
      sidebar.checkVolumeName(name); // Посмотреть тут. Или не ждет появления карточки или не ту карту смотрит
    });
    sidebar.checkVolumeActionBox();
  });

  it('Display of snapshots + action box of a root disk', () => {
    sidebar.createSnapshot().then(snapname => {
      sidebar.clickBell();
      sidebar.waitBellMessage('Snapshot taken');
      sidebar.verifyBellMessage('Snapshot taken');
      sidebar.checkSnapshotNameSidebar(snapname);
      sidebar.checkSnapshotActions();
      sidebar.clickViewAllSnaoshots();
      sidebar.checkSnapshotNameDialog(snapname);
      sidebar.clickYesDialogButton();
    });
    sidebar.checkRootVolumeActionBox();
  });

  it('Volume creation from snapshot', () => {
    sidebar.createVolumeFromSnapshot().then(volumename => {
      sidebar.clickBell();
      sidebar.waitBellMessage('Volume created');
      sidebar.verifyBellMessage('Volume created');
      vmlist.clickStorageMenu();
      disklist = new DiskList();
      expect(disklist.getDiskName(volumename)).toBeTruthy(`Disk name "${volumename}" wasn't found`);
      vmlist.navigateTo('/instances');
      vmlist.waitRedirect('instances');
    });
  });

  it('Snapshot deleting', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickStorageTab();
    sidebar.deleteSnapshot();
    sidebar.clickBell();
    sidebar.waitBellMessage('Snapshot deleted');
    sidebar.verifyBellMessage('Snapshot deleted');
    sidebar.checkLackSnapshots();
  });
});
