import { browser, by, element } from 'protractor';
import { DiskList } from './pages/disk-list.po';
import { Login } from './pages/login.po';
import { DiskSidebar } from './pages/disk-sidebar.po';

describe('e2e-test-disk-details', () => {
  let disklist: DiskList;
  let login: Login;
  let disksidebar: DiskSidebar;

  beforeAll(() => {
    browser.driver
      .manage()
      .window()
      .maximize();
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

  it('Change description of disk in sidebar', () => {
    disklist.openDiskSidebar();
    disksidebar.setDescription(disksidebar.description);
  });

  it('Verify description of disk is changed', () => {
    expect(disksidebar.getDescription()).toEqual(disksidebar.description);
    disklist.clickClose();
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Description changed')).toBeTruthy('No bell message found');
    disklist.clickBell();
  });

  it('Create snapshot for ready disk', () => {
    expect(disklist.getDiskState()).toEqual('State: Ready');
    disklist.clickOnReadyDisk();
    disksidebar.clickSnapshotTab();
    disksidebar.clickCreateSnapshot();
    disksidebar.waitDialog();
    disksidebar.setSnapshotName(disksidebar.snapshotname);
    disksidebar.setSnapshotDescription(disksidebar.snapshotdesc);
    disksidebar.clickYesDialogButton();
    const EC = browser.ExpectedConditions;
    browser.wait(
      EC.presenceOf(element(by.css('cs-volume-snapshot .mat-card'))),
      5000,
      'Snapshot is not created',
    );
  });

  it('Verify snapshot is created', () => {
    expect(disksidebar.getSnapshotName()).toEqual(disksidebar.snapshotname);
    expect(disksidebar.getSnapshotDescription()).toEqual(disksidebar.snapshotdesc);

    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Snapshot taken')).toBeTruthy('No bell message found');
    disklist.clickBell();
    disksidebar.clickClose();
  });

  it('Create volume from snapshot of ready disk', () => {
    expect(disklist.getDiskState()).toEqual('State: Ready');
    disklist.clickOnReadyDisk();
    disksidebar.clickSnapshotTab();
    disksidebar.clickActionBoxOfSnapshot();
    disksidebar.clickCreateVolume();
    disksidebar.waitDialog();
    disksidebar.setVolumeName(disksidebar.diskfromsnap);
    disksidebar.clickYesDialogButton();
    const EC = browser.ExpectedConditions;
    browser.wait(EC.presenceOf(element(by.css('.open'))), 5000, "Sidebar doesn't open");
  });

  it('Verify creation of disk from snapshot of ready disk', () => {
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Volume created')).toBeTruthy('No bell message found');
    disklist.clickBell();
    browser.refresh();
    disklist.clickClose();
    expect(disklist.getDiskName(disksidebar.diskfromsnap)).toBeTruthy(
      'Do not found disk with the same name',
    );
    expect(disklist.findDiskSize('ROOT-3')).toEqual(
      disklist.findDiskSize(disksidebar.diskfromsnap),
    );
  });

  it('Delete snapshot of ready disk', () => {
    expect(disklist.getDiskState()).toEqual('State: Ready');
    disklist.clickOnReadyDisk();
    disksidebar.clickSnapshotTab();
    disksidebar.clickActionBoxOfSnapshot();
    disksidebar.clickDeleteSnapshot();
    disksidebar.waitDialog();
    disksidebar.clickYesDialogButton();
    const EC = browser.ExpectedConditions;
    browser.wait(EC.presenceOf(element(by.css('.open'))), 5000, "Sidebar doesn't open");
  });

  it('Verify snapshot is deleted', () => {
    const EC = browser.ExpectedConditions;
    browser.wait(
      EC.presenceOf(element(by.css('.no-results'))),
      5000,
      "Sidebar doesn't open or list of snapshots does not empty",
    );
    expect(disksidebar.getNoResult('No results')).toBeTruthy('List of snapshots does not empty');
    disklist.clickClose();
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Snapshot deleted')).toBeTruthy('No bell message found');
    disklist.clickBell();
  });
});
