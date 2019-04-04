import { browser } from 'protractor';
import { DiskList } from './pages/disk-list.po';
import { Login } from './pages/login.po';
import { DiskSidebar } from './pages/disk-sidebar.po';
import { DiskCreation } from './pages/disk-creation.po';

describe('e2e-test-disk-creation', () => {
  let disklist: DiskList;
  let login: Login;
  let diskcreation: DiskCreation;
  let disksidebar: DiskSidebar;

  beforeAll(() => {
    login = new Login();
    login.navigateTo('/');
    login.login();
    login.waitRedirect('instances');
    login.clickStorageMenu();
  });

  beforeEach(() => {
    disklist = new DiskList();
    disksidebar = new DiskSidebar();
  });

  afterAll(() => {
    login.logout();
  });

  //TODO: no slider element appears for disk creation with custom DO,
  // https://github.com/bwsw/cloudstack-ui/issues/1651

  xit('Create disk with Custom DO', () => {
    diskcreation = new DiskCreation();
    disklist.clickCreateDisk();
    disklist.waitDialogModal();
    expect(disklist.getDialog().isPresent()).toBeTruthy('No modal dialog for disk creation');
    diskcreation.setName(diskcreation.diskcustom);
    diskcreation.setZone();
    diskcreation.setCustomDO();
    diskcreation.setDiskSize(2);
    diskcreation.clickYesDialogButton();
  });

  xit('Verify notification about creation of Custom disk', () => {
    // browser.sleep(500); // Костыль. Пока не рашим проблему с waitForAngular в vm_creation
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Volume created')).toBeTruthy('No bell message found');
    disklist.clickBell();
  });

  xit('Verify card of disk with CustomDO: name, size, status', () => {
    disklist.clickSpareDrives();
    expect(disklist.getDiskName(diskcreation.diskcustom)).toBeTruthy('Wrong disk name');
    expect(disklist.getDiskSize('12')).toBeTruthy('Wrong disk size');
    expect(disklist.getDiskState()).toEqual(disklist.diskstate);
  });

  xit('Verify sidebar of custom disk: name, size', () => {
    disklist.openDiskSidebar(diskcreation.diskcustom);
    expect(disksidebar.getDiskName(diskcreation.diskcustom)).toBeTruthy('Wrong disk name');
    expect(disksidebar.getDiskSize('12')).toBeTruthy('Wrong disk size');
    disksidebar.clickCloseSidebar();
    disklist.clickSpareDrives();
  });

  it('Create disk with Fixed DO', () => {
    diskcreation = new DiskCreation();
    disklist.clickCreateDisk();
    disklist.waitDialogModal();
    expect(disklist.getDialog().isPresent()).toBeTruthy('No modal dialog for disk creation');
    diskcreation.setName(diskcreation.diskfixed);
    diskcreation.setZone();
    diskcreation.selectFixedDO();
    diskcreation.waitDialogModal();
    diskcreation.clickYesDialogButton();
  });

  it('Verify notification about creation of disk', () => {
    // browser.sleep(500); //  Костыль. Пока не рашим проблему с waitForAngular в vm_creation
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Volume created')).toBeTruthy('No bell message found');
    disklist.clickBell();
  });

  it('Verify card of disk with FixedDO: name, size, status', () => {
    disklist.clickSpareDrives();
    expect(disklist.getDiskName(diskcreation.diskfixed)).toBeTruthy('Wrong disk name');
    expect(disklist.getDiskSize('5')).toBeTruthy('Wrong disk size');
    expect(disklist.getDiskState()).toEqual(disklist.diskstate);
  });

  it('Verify sidebar of fixed disk: name, size', () => {
    disklist.openDiskSidebar(diskcreation.diskfixed);
    expect(disksidebar.getDiskName(diskcreation.diskfixed)).toBeTruthy('Wrong disk name');
    expect(disksidebar.getDiskSize('5')).toBeTruthy('Wrong disk size');
    disksidebar.clickCloseSidebar();
    disklist.clickSpareDrives();
  });
});
