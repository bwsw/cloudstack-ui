import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatDialog,
  MatTooltipModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { Iso } from '../../../template/shared/iso.model';
import { Template } from '../../../template/shared/template.model';
import { VmTemplateDialogComponent } from './vm-template-dialog.component';
import { VmCreationTemplateComponent } from './vm-creation-template.component';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslateService } from '../../../../testutils/mocks/mock-translate.service.spec';

const templatesRaw = require(
  '../../../../testutils/mocks/model-services/fixtures/templates.json');
const isosRaw = require('../../../../testutils/mocks/model-services/fixtures/isos.json');

const templates: Array<Template> = [
  ...templatesRaw.map(t => new Template(t)),
  ...isosRaw.map(i => new Iso(i))
];

@Component({
  selector: 'cs-test',
  template: `
    <cs-vm-creation-template
      [(ngModel)]="template"
    ></cs-vm-creation-template>
  `
})
class TestComponent {
  @ViewChild(VmCreationTemplateComponent) public vmTemplateComponent: VmCreationTemplateComponent;
  public template: BaseTemplateModel;
  public templates: Array<Template>;
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
        afterClosed: () => Observable.of(template)
      };
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatTooltipModule
      ],
      declarations: [
        VmCreationTemplateComponent,
        TestComponent,
        MockTranslatePipe
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    })
      .compileComponents();
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

    const messageContainer = f.debugElement.query(By.css('.mat-input-wrapper'));
    expect(messageContainer.nativeElement.textContent.trim()).toBe(
      `VM_PAGE.VM_CREATION.NO_TEMPLATES`
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
