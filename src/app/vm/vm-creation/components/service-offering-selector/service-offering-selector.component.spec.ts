import { Component, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatTooltipModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../../../testutils/mocks/mock-translate.service.spec';
import { ServiceOffering } from '../../../../shared/models';
import { ServiceOfferingSelectorComponent } from './service-offering-selector.component';

const serviceOfferingsRaw = require('../../../../../testutils/mocks/model-services/fixtures/serviceOfferings.json');
const serviceOfferings = [...serviceOfferingsRaw];

@Component({
  selector: 'cs-test',
  template: `
    <cs-service-offering-selector
      [serviceOfferings]="serviceOfferings"
    ></cs-service-offering-selector>
  `,
})
class TestComponent {
  @ViewChild(ServiceOfferingSelectorComponent)
  public serviceOfferingSelectorComponent: ServiceOfferingSelectorComponent;
  public serviceOffering: ServiceOffering;
  public serviceOfferings: ServiceOffering[];
}

describe('Test Service offering selector component', () => {
  const serviceOffering = serviceOfferings[1];

  function createTestComponent() {
    const f = TestBed.createComponent(TestComponent);
    const testComponent = f.componentInstance;
    testComponent.serviceOfferings = serviceOfferings;
    testComponent.serviceOffering = serviceOfferings[0];

    return { f, testComponent };
  }

  const mockDialog = {
    open: jasmine.createSpy('open').and.callFake(() => {
      return {
        afterClosed: () => of(serviceOffering),
      };
    }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MatTooltipModule],
      declarations: [ServiceOfferingSelectorComponent, TestComponent, MockTranslatePipe],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: TranslateService, useClass: MockTranslateService },
      ],
    }).compileComponents();
  }));

  it('should show message if offeringList is empty', async(async () => {
    const { f } = createTestComponent();

    await f.whenStable();
    f.detectChanges();

    const messageContainer = f.debugElement.query(By.css('.mat-form-field-wrapper'));
    expect(messageContainer.nativeElement.textContent.trim()).toBe(
      `VM_PAGE.VM_CREATION.NO_OFFERINGS`,
    );
    expect(messageContainer.query(By.css('span'))).toBeDefined();
  }));

  it('should show selected offering', async(async () => {
    const { f, testComponent } = createTestComponent();

    await f.whenStable();
    f.detectChanges();

    const messageContainer = f.debugElement.query(By.css('.mat-form-field-wrapper'));
    expect(messageContainer.query(By.css('span.custom-offering-info'))).toBeDefined();
    testComponent.serviceOfferingSelectorComponent.serviceOffering = serviceOfferings[0];
    await f.whenStable();
    f.detectChanges();
    expect(testComponent.serviceOfferingSelectorComponent.serviceOffering).toBe(
      serviceOfferings[0],
    );

    expect(messageContainer.nativeElement.textContent.trim()).toBe(
      `VM_PAGE.VM_CREATION.SERVICE_OFFERING: ${serviceOfferings[0].name}`,
    );
  }));

  it('should show selected custom offering', async(async () => {
    const { f, testComponent } = createTestComponent();

    await f.whenStable();
    f.detectChanges();

    const messageContainer = f.debugElement.query(By.css('.mat-form-field-wrapper'));
    expect(messageContainer.query(By.css('span.custom-offering-info'))).toBeDefined();
    testComponent.serviceOfferingSelectorComponent.serviceOffering = serviceOfferings[2];
    await f.whenStable();
    f.detectChanges();
    expect(testComponent.serviceOfferingSelectorComponent.serviceOffering).toBe(
      serviceOfferings[2],
    );

    expect(messageContainer.nativeElement.textContent.trim()).toBe(
      `VM_PAGE.VM_CREATION.SERVICE_OFFERING: ${serviceOfferings[2].name} - ` +
        `${serviceOfferings[2].cpunumber}x${serviceOfferings[2].cpuspeed} UNITS.MHZ, ` +
        `${serviceOfferings[2].memory} UNITS.MB`,
    );
  }));

  it('should open modal window', async(async () => {
    const { f, testComponent } = createTestComponent();
    testComponent.serviceOfferingSelectorComponent.serviceOffering = serviceOfferings[0];

    await f.whenStable();
    f.detectChanges();

    expect(testComponent.serviceOfferingSelectorComponent.serviceOffering).toBe(
      serviceOfferings[0],
    );

    const button = f.debugElement.query(By.css('button'));
    button.nativeElement.click();
    f.detectChanges();
    expect(mockDialog.open).toHaveBeenCalled();
    const args = mockDialog.open.calls.mostRecent().args;
    expect(args[1]).toEqual({
      width: '700px',
      disableClose: true,
      data: {
        serviceOffering: serviceOfferings[0],
      },
    });
  }));

  it('should emit changes form change dialog', () => {
    const { f, testComponent } = createTestComponent();
    testComponent.serviceOfferingSelectorComponent.serviceOffering = serviceOfferings[0];
    f.detectChanges();

    spyOn(testComponent.serviceOfferingSelectorComponent.changed, 'next');
    const button = f.debugElement.query(By.css('button'));
    expect(testComponent.serviceOfferingSelectorComponent.serviceOffering).toEqual(
      serviceOfferings[0],
    );
    button.nativeElement.click();
    f.detectChanges();

    expect(testComponent.serviceOfferingSelectorComponent.changed.next).toHaveBeenCalledTimes(1);
    expect(testComponent.serviceOfferingSelectorComponent.changed.next).toHaveBeenCalledWith(
      serviceOfferings[1],
    );
    expect(testComponent.serviceOfferingSelectorComponent.serviceOffering).toEqual(
      serviceOfferings[1],
    );
  });
});
