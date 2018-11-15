import { VMCreation } from './pages/vm-creation.po';
import { browser } from 'protractor';
import { VMList } from './pages/vm-list.po';

describe('e2e-test-vm-creation', () => {
  let page: VMCreation;
  let vmlist: VMList;

  beforeEach(() => {
    page = new VMCreation();
    vmlist = new VMList();
    page.navigateTo();
  });

  it('Create VM with ISO, group, aff-group', () => {
    page.login();
    browser.waitForAngularEnabled(false);
    page.waitRedirect('instances');
    vmlist.waitVMPropose();
    vmlist.checkVMPropose();
    vmlist.confirmVMPropose();
    // Add wait creation windows
    page.clickSelectInstSource();
    browser.sleep(5000);
  });
});
