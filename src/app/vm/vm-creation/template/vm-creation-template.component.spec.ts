import { Component, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatTooltipModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { Iso } from '../../../template/shared/iso.model';
import { Template } from '../../../template/shared/template.model';
import { VmCreationTemplateComponent } from './vm-creation-template.component';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../../../../testutils/mocks/mock-translate.service.spec';

const templatesRaw: Template[] = require('../../../../testutils/mocks/model-services/fixtures/templates.json');
const isosRaw: Iso[] = require('../../../../testutils/mocks/model-services/fixtures/isos.json');

const templates: BaseTemplateModel[] = [...templatesRaw, ...isosRaw];

@Component({
  selector: 'cs-test',
  template: `
    <cs-vm-creation-template
      [(ngModel)]="template"
    ></cs-vm-creation-template>
  `,
})
class TestComponent {
  @ViewChild(VmCreationTemplateComponent)
  public vmTemplateComponent: VmCreationTemplateComponent;
  public template: BaseTemplateModel;
  public templates: BaseTemplateModel[];
}

describe('VmCreationTemplateComponent', () => {
  // tslint:disable-next-line
  let template: BaseTemplateModel;

  function createTestComponent() {
    const f = TestBed.createComponent(TestComponent);
    const testComponent = f.componentInstance;
    testComponent.templates = templates;
    testComponent.template = templates[0];

    return { f, testComponent };
  }

  const mockDialog = {
    open: jasmine.createSpy('open').and.callFake(() => {
      return {
        afterClosed: () => of(template),
      };
    }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MatTooltipModule],
      declarations: [VmCreationTemplateComponent, TestComponent, MockTranslatePipe],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: TranslateService, useClass: MockTranslateService },
      ],
    }).compileComponents();
  }));

  // it('should display selectedTemplate name', async(async () => {
  //   const { f } = createTestComponent();
  //   f.detectChanges();
  //
  //   await f.whenStable();
  //   f.detectChanges();
  //
  //   const messageContainer = f.debugElement.query(By.css('.ellipsis-overflow'));
  //   expect(messageContainer.nativeElement.textContent.trim()).toBe(
  //     `VM_PAGE.VM_CREATION.OS_TEMPLATE: ${templates[0].name}`
  //   );
  // }));

  it('should display error message when templates and isos are empty', async(async () => {
    const { f } = createTestComponent();

    await f.whenStable();
    f.detectChanges();

    const messageContainer = f.debugElement.query(By.css('.mat-form-field-wrapper'));
    expect(messageContainer.nativeElement.textContent.trim()).toBe(
      `VM_PAGE.VM_CREATION.NO_TEMPLATES`,
    );
    expect(messageContainer.query(By.css('span.no-templates'))).toBeDefined();
  }));

  // it('should open the dialog', () => {
  //   fixture = TestBed.createComponent(VmCreationTemplateComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //
  //   component.template = templates[0];
  //   const button = fixture.debugElement.query(By.css('button'));
  //
  //   button.nativeElement.click();
  //   fixture.detectChanges();
  //
  //   expect(mockDialog.open).toHaveBeenCalled();
  //   const args = mockDialog.open.calls.mostRecent().args;
  //   expect(args[0]).toBe(VmTemplateDialogComponent);
  //   expect(args[1]).toEqual({
  //     width: '776px',
  //     data: {
  //       template: templates[0]
  //     }
  //   });
  // });

  // it('should emit changes after dialog is closed', () => {
  //   fixture = TestBed.createComponent(VmCreationTemplateComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //
  //   spyOn(component.change, 'next');
  //   const button = fixture.debugElement.query(By.css('button'));
  //
  //   button.nativeElement.click();
  //   fixture.detectChanges();
  //
  //   expect(component.change.next).toHaveBeenCalledTimes(0);
  //   expect(component.template).toBeUndefined();
  //
  //   template = templates[0];
  //   button.nativeElement.click();
  //   fixture.detectChanges();
  //   fixture.detectChanges();
  //   fixture.detectChanges();
  //
  //   expect(component.change.next).toHaveBeenCalledTimes(1);
  //   expect(component.change.next).toHaveBeenCalledWith(templates[0]);
  //   expect(component.template).toEqual(templates[0]);
  // });
});
