import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { MaxValueValidatorDirective } from '../../shared/directives/max-value.directive';
import { MinValueValidatorDirective } from '../../shared/directives/min-value.directive';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { CustomServiceOffering } from './custom-service-offering';
import { CustomServiceOfferingComponent } from './custom-service-offering.component';

const so = require('../../../testutils/mocks/model-services/fixtures/serviceOfferings.json');

describe('CustomServiceOfferingComponent', () => {
  let component: CustomServiceOfferingComponent;
  let fixture: ComponentFixture<CustomServiceOfferingComponent>;

  let mockDialogRef;
  let customOffering;
  let dialogData;

  async function configureTestBed(data) {
    mockDialogRef = {
      close: jasmine.createSpy('close')
    };
    customOffering = new CustomServiceOffering({
      cpuNumber: 1,
      cpuSpeed: 1500,
      memory: 1000,
      serviceOffering: so[0]
    });
    dialogData = {
      offering: customOffering,
      zoneId: 'someId',
      restriction: {
        cpuNumber: {
          min: 0,
          max: 4
        },
        cpuSpeed: {
          min: 1000,
          max: 2000
        },
        memory: {
          min: 32,
          max: 2000
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, FormsModule, MatDialogModule, MatInputModule],
      declarations: [
        CustomServiceOfferingComponent,
        MockTranslatePipe,
        MinValueValidatorDirective,
        MaxValueValidatorDirective
      ],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data || dialogData
        },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomServiceOfferingComponent);
    component = fixture.componentInstance;
  }

  it(
    'should keep input service offering immutable',
    async(async () => {
      await configureTestBed(dialogData);

      fixture.detectChanges();
      await fixture.whenStable();

      const cpuNumberTextfield = fixture.debugElement.query(
        By.css('[name="cpuNumber"]')
      );
      const cpuSpeedTextfield = fixture.debugElement.query(
        By.css('[name="cpuSpeed"]')
      );

      cpuNumberTextfield.nativeElement.value = 3;
      cpuSpeedTextfield.nativeElement.value = 1000;
      cpuNumberTextfield.nativeElement.dispatchEvent(new Event('input'));
      cpuSpeedTextfield.nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.offering.cpuNumber).toBe(3);
      expect(component.offering.cpuSpeed).toBe(1000);

      // original offering should not change
      expect(customOffering.cpuNumber).toBe(1);
      expect(customOffering.cpuSpeed).toBe(1500);
    })
  );

  it(
    'should pass configured service offering on save',
    async(async () => {
      await configureTestBed(dialogData);

      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );

      submitButton.nativeElement.click();
      fixture.detectChanges();
      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
      expect(mockDialogRef.close).toHaveBeenCalledWith(customOffering);

      component.offering.cpuNumber = 4;
      submitButton.nativeElement.click();
      fixture.detectChanges();

      const expected = new CustomServiceOffering({
        serviceOffering: customOffering
      });
      expected.cpuNumber = 4;
      expected.cpuSpeed = 1500;
      expected.memory = 1000;
      expect(mockDialogRef.close).toHaveBeenCalledTimes(2);
      expect(mockDialogRef.close.calls.mostRecent().args).toEqual([expected]);
    })
  );

  it(
    'should ignore changes to passed service offering on cancel',
    async(async () => {
      await configureTestBed(dialogData);

      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="button"]')
      );

      component.offering.cpuNumber = 4;
      submitButton.nativeElement.click();
      fixture.detectChanges();
      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
      // TODO check why it is called with empty string
      expect(mockDialogRef.close).toHaveBeenCalledWith('');
    })
  );
});
