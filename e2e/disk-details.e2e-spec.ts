import { browser, by, element } from 'protractor';
import { DiskList } from './pages/disk-list.po';
import { Login } from './pages/login.po';
import { DiskSidebar } from './pages/disk-sidebar.po';

describe('e2e-test-disk-details', () => {
  let disklist: DiskList;
  let disksidebar: DiskSidebar;
  let login: Login;

  beforeAll(() => {
    login = new Login();
    login.navigateTo('/');
    login.login();
    login.waitRedirect('instances');
    login.clickStorageMenu();
    disklist = new DiskList();
    disklist.openSidebarReadyDisk();
  });

  beforeEach(() => {
    disksidebar = new DiskSidebar();
  });

  afterAll(() => {
    disklist.clickCloseSidebar();
    login.logout();
  });

  it('Change description of disk in sidebar', () => {
    disksidebar.setDescription(disksidebar.description);
    expect(disksidebar.getDescription()).toEqual(disksidebar.description);
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Description changed')).toBeTruthy('No bell message found');
    disklist.clickBell();
  });

  it('Create snapshot for ready disk', () => {
    disksidebar.clickSnapshotTab();
    disksidebar.clickCreateSnapshot();
    disksidebar.waitDialog();
    disksidebar.setSnapshotName(disksidebar.snapshotname);
    disksidebar.setSnapshotDescription(disksidebar.snapshotdesc);
    disksidebar.clickYesDialogButton();
    disksidebar.waitCreatingSnapshot();
    expect(disksidebar.getSnapshotName()).toEqual(disksidebar.snapshotname);
    expect(disksidebar.getSnapshotDescription()).toEqual(disksidebar.snapshotdesc);
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Snapshot taken')).toBeTruthy('No bell message found');
    disklist.clickBell();
  });

  it('Create volume from snapshot of ready disk', () => {
    disksidebar.clickSnapshotTab();
    disksidebar.clickActionBoxOfSnapshot();
    disksidebar.clickCreateVolume();
    disksidebar.waitDialog();
    disksidebar.setVolumeName(disksidebar.diskfromsnap);
    disksidebar.clickYesDialogButton();
    disksidebar.waitActionProcess();
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Volume created')).toBeTruthy('No bell message found');
    disklist.clickBell();
    browser.refresh(); // TODO: bug CSUI(backlog) disk does not appears without refresh the page
    expect(disklist.getDiskName(disksidebar.diskfromsnap)).toBeTruthy(
      'Do not found disk with the same name',
    );
    expect(disklist.getSizeReadyDisk()).toEqual(disklist.findDiskSize(disksidebar.diskfromsnap));
  });

  it('Delete snapshot of ready disk', () => {
    disksidebar.clickSnapshotTab();
    disksidebar.clickActionBoxOfSnapshot();
    disksidebar.deleteSnapshot();
    disklist.clickBell();
    disklist.waitDialog();
    expect(disklist.verifyBellMessage('Snapshot deleted')).toBeTruthy('No bell message found');
    disklist.clickBell();
  });
});
