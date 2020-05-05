///<reference path="pages/vm-list.po.ts"/>
import { browser, by, element } from 'protractor';
import { VMList } from './pages/vm-list.po';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';

describe('e2e-test-vm-list', () => {
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
  });

  beforeEach(() => {
    vmlist = new VMList();
    sidebar = new VMSidebar();
  });

  it('Filter by state', () => {
    vmlist.selectFilter('state', 'Running');
    expect(vmlist.checkStateVm('running')).toBeTruthy(
      'Filter is Running. There are no VMs in the status "Running"',
    );
    expect(vmlist.checkStateVm('stopped')).toBeFalsy(
      'Filter is Running. There are VMs in the status "Stopped"',
    );
    vmlist.selectFilter('state', 'Running');
    vmlist.selectFilter('state', 'Stopped');
    expect(vmlist.checkStateVm('stopped')).toBeTruthy(
      'Filter is Stopped. There are no VMs in the status "Stopped"',
    );
    expect(vmlist.checkStateVm('running')).toBeFalsy(
      'Filter is Stopped. There are VMs in the status "Running"',
    );
    vmlist.selectFilter('state', 'Stopped');
    expect(vmlist.checkStateVm('running')).toBeTruthy(
      'Filter is null. There are no VMs in the status "Running"',
    );
    expect(vmlist.checkStateVm('stopped')).toBeTruthy(
      'Filter is null. There are no VMs in the status "Stopped"',
    );
  });

  it('Filter by zone', () => {
    vmlist.getVmNameList().then(originalVmList => {
      vmlist.selectFilter('zone', 'Sandbox-simulator');
      vmlist.getVmNameList().then(currentVmList => {
        expect(originalVmList).toEqual(currentVmList);
      });
    });
    vmlist.selectFilter('zone', 'Sandbox-simulator');
  });

  it('Search by existing name', () => {
    vmlist.getVMNameCard().then(vmName => {
      vmlist.inputSearchValue(vmName);
      vmlist.checkSearchResult(vmName);
    });
    vmlist.clearSearch();
  });

  it('Search by non-existent name', () => {
    vmlist.inputSearchValue('non_existent');
    vmlist.checkAbsenceSearchResult();
    vmlist.clearSearch();
  });

  it('Starting of stopped VM without password enabled', () => {
    // Check sidebar action box
    vmlist.clickOpenSidebar(0);
    sidebar.clickSidebar();
    vmlist.checkVmActionBox();
    sidebar.clickCloseActionBox();
    sidebar.clickCloseSidebar();
    // Check start of stopped VM
    const stoppedVM = vmlist.getVMbyState('stopped');
    vmlist.getNameOfSpecificVm(stoppedVM).then(nameVM => {
      vmlist.clickActionBoxbyVM(stoppedVM);
      vmlist.checkVmActionBox();
      // vmlist.checkEnabledForStoppedVM();
      vmlist.clickStartVM();
      vmlist.clickYesDialogButton();
      vmlist.waitMessage('VM started');
      vmlist.clickBell();
      vmlist.verifyBellMessage('VM started');
      expect(vmlist.getStateRunningByName(nameVM).isPresent()).toBeTruthy(
        `VM ${nameVM} haven't running state`,
      );
      vmlist.clickActionBoxByName(nameVM);
      vmlist.checkEnabledForRunningVM();
      vmlist.clickCloseActionBox();
    });
  });

  it('Stopping of running VM', () => {
    const runningVM = vmlist.getVMbyState('running');
    vmlist.getNameOfSpecificVm(runningVM).then(nameVM => {
      vmlist.clickActionBoxbyVM(runningVM);
      vmlist.checkEnabledForRunningVM();
      vmlist.clickStopVM();
      vmlist.clickYesDialogButton();
      vmlist.waitMessage('VM stopped');
      vmlist.clickBell();
      vmlist.verifyBellMessage('VM stopped');
      expect(vmlist.getStateStoppedByName(nameVM).isPresent()).toBeTruthy(
        `VM ${nameVM} haven't stopped state`,
      );
      vmlist.clickActionBoxByName(nameVM);
      vmlist.checkEnabledForStoppedVM();
      vmlist.clickCloseActionBox();
    });
  });

  it('Rebooting of running VM', () => {
    const runningVM = vmlist.getVMbyState('running');
    vmlist.getNameOfSpecificVm(runningVM).then(nameVM => {
      vmlist.clickActionBoxbyVM(runningVM);
      vmlist.clickRebootVM();
      vmlist.clickYesDialogButton();
      vmlist.waitMessage('VM rebooted');
      vmlist.clickBell();
      vmlist.verifyBellMessage('VM rebooted');
      expect(vmlist.getStateRunningByName(nameVM).isPresent()).toBeTruthy(
        `VM ${nameVM} haven't running state`,
      );
    });
  });

  it('Reinstalling of running VM', () => {
    const runningVM = vmlist.getVMbyState('running');
    vmlist.getNameOfSpecificVm(runningVM).then(nameVM => {
      vmlist.clickActionBoxbyVM(runningVM);
      vmlist.clickReinstallVM();
      vmlist.clickYesDialogButton();
      vmlist.waitMessage('VM reinstalled');
      vmlist.clickBell();
      vmlist.verifyBellMessage('VM reinstalled');
      expect(vmlist.getStateRunningByName(nameVM).isPresent()).toBeTruthy(
        `VM ${nameVM} haven't running state`,
      );
    });
  });

  it('Destroying of running VM', () => {
    const runningVM = vmlist.getVMbyState('running');
    vmlist.getNameOfSpecificVm(runningVM).then(nameVM => {
      vmlist.clickActionBoxbyVM(runningVM);
      vmlist.clickDestroyVM();
      vmlist.clickYesDialogButton();
      vmlist.waitMessage('VM destroyed');
      vmlist.clickBell();
      vmlist.verifyBellMessage('VM destroyed');
      expect(vmlist.getStateDestroyed(nameVM).isPresent()).toBeTruthy(
        `VM ${nameVM} haven't destroyed state`,
      );
    });
  });

  it('Recovering of destroyed VM', () => {
    const destroyedVM = vmlist.getVMbyState('destroyed');
    vmlist.getNameOfSpecificVm(destroyedVM).then(nameVM => {
      vmlist.clickActionBoxbyVM(destroyedVM);
      vmlist.clickRecoverVM();
      vmlist.clickYesDialogButton();
      vmlist.waitMessage('VM recovered');
      vmlist.clickBell();
      vmlist.verifyBellMessage('VM recovered');
      expect(vmlist.getStateStoppedByName(nameVM).isPresent()).toBeTruthy(
        `VM ${nameVM} haven't stopped state`,
      );
    });
  });

  it('Expunging when destroying of running VM', () => {
    const stoppedVM = vmlist.getVMbyState('stopped');
    vmlist.getNameOfSpecificVm(stoppedVM).then(nameVM => {
      vmlist.clickActionBoxbyVM(stoppedVM);
      vmlist.clickStartVM();
      vmlist.clickYesDialogButton();
      vmlist.waitMessage('VM started');
      vmlist.waitCloseMessage();
      const runningVM = vmlist.getVMbyState('running');
      vmlist.getNameOfSpecificVm(runningVM).then(runningVmName => {
        vmlist.clickActionBoxbyVM(runningVM);
        vmlist.clickDestroyVM();
        vmlist.clickCheckBox();
        vmlist.clickYesDialogButton();
        vmlist.clickBell();
        expect(vmlist.verifyBellMessage('VM expunged')).toBeTruthy(
          'Messages "VM expunged" is not in the notification bell',
        );
        expect(vmlist.getVMByName(runningVmName).isPresent()).toBeFalsy(
          `There is a VM with the name ${runningVmName}`,
        );
      });
    });
  });

  it('Expunging of destroyed VM', () => {
    const stoppedVM = vmlist.getVMbyState('stopped');
    vmlist.getNameOfSpecificVm(stoppedVM).then(nameVM => {
      vmlist.clickActionBoxbyVM(stoppedVM);
      vmlist.clickDestroyVM();
      vmlist.clickYesDialogButton();
      vmlist.waitMessage('VM destroyed');
      vmlist.waitCloseMessage();
      const destroyedVM = vmlist.getVMbyState('destroyed');
      vmlist.getNameOfSpecificVm(destroyedVM).then(destroyedVmName => {
        vmlist.clickActionBoxbyVM(destroyedVM);
        vmlist.clickExpungeVM();
        vmlist.clickYesDialogButton();
        vmlist.waitMessage('VM expunged');
        vmlist.clickBell();
        expect(vmlist.verifyBellMessage('VM expunged')).toBeTruthy(
          'Messages "VM expunged" is not in the notification bell',
        );
        expect(vmlist.getVMByName(destroyedVmName).isPresent()).toBeFalsy(
          `There is a VM with the name ${destroyedVmName}`,
        );
      });
    });
  });
});
