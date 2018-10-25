import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Color } from '../../models';
import { PopoverModule } from '../popover/index';
import { ColorPickerComponent } from './color-picker.component';

describe('Color picker component', () => {
  let fixture;
  let component: ColorPickerComponent;
  const colors: Color[] = [
    { name: 'red', value: '#F44336', textColor: '#FFFFFF' },
    { name: 'pink', value: '#E91E63', textColor: '#FFFFFF' },
    { name: 'purple', value: '#9C27B0', textColor: '#FFFFFF' },
    { name: 'deep_purple', value: '#673AB7', textColor: '#FFFFFF' },
    { name: 'indigo', value: '#3F51B5', textColor: '#FFFFFF' },
    { name: 'blue', value: '#2196F3', textColor: '#FFFFFF' },
  ];

  @Component({
    selector: 'cs-test',
    template: `
      <cs-color-picker
        [colors]="colors"
        [colorsPerLine]="colorsPerLine"
        [(ngModel)]="selectedColor"
      ></cs-color-picker>
    `,
  })
  class ColorPickerTestComponent {
    public colors = colors;
    public selectedColor: Color;
    public colorsPerLine: number;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, PopoverModule],
      declarations: [ColorPickerComponent, ColorPickerTestComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
  }));

  it('reacts to changes', () => {
    const f = TestBed.createComponent(ColorPickerTestComponent);
    f.detectChanges();

    const asd = f.debugElement.query(By.directive(ColorPickerComponent)).componentInstance;

    expect(asd.colorsPerLine).toBe(3);
    expect(asd.colorWidth).toBe(asd.containerWidth / 3);

    f.componentInstance.colorsPerLine = colors.length + 2;
    f.detectChanges();
    expect(asd.colorsPerLine).toBe(colors.length);
    expect(asd.colorWidth).toBe(asd.containerWidth / colors.length);

    f.componentInstance.colors = colors.slice(0, 4);
    f.detectChanges();
    expect(asd.colorsPerLine).toBe(2);
    expect(asd.colorWidth).toBe(256 / 2);
  });

  it('should select a color', fakeAsync(async () => {
    component.colors = colors;
    fixture.detectChanges();

    fixture.debugElement.query(By.css('input')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.popoverTrigger.open).toBe(true);
    const colorElement = fixture.debugElement.query(By.css('.color'));
    colorElement.triggerEventHandler('click');
    expect(component.popoverTrigger.open).toBe(false);
    expect(component.selectedColor).toEqual(colors[0]);

    fixture.debugElement.query(By.css('.color-preview-container')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.popoverTrigger.open).toBe(true);
  }));

  it('should update using ngModel', fakeAsync(() => {
    const f = TestBed.createComponent(ColorPickerTestComponent);
    f.detectChanges();

    f.componentInstance.selectedColor = colors[colors.length - 1];
    f.detectChanges();
    f.whenStable().then(() => {
      const colorPickerComponent = f.debugElement.query(By.directive(ColorPickerComponent));
      expect(colorPickerComponent.componentInstance.selectedColor).toEqual(
        colors[colors.length - 1],
      );
    });
  }));
});
