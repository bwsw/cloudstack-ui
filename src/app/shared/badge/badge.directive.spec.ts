import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeDirective } from './badge.directive';
import { BadgeModule } from './index';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'cs-test-component',
  template: `
    <button [csBadge]="count"></button>
    <button [csBadge]="count" csBadgeOverlap></button>
  `
})
class TestComponent {
  public count = 0;
}

describe('BadgeDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [BadgeModule],
        declarations: [TestComponent]
      });

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should add "badge" css class and "data-badge" attribute', () => {
    const buttons = fixture.debugElement
      .queryAll(By.css('button'))
      .map(_ => _.nativeElement);
    expect(buttons.every(button => button.classList.contains('badge'))).toBe(true);
    expect(
      buttons.every(
        button => button.getAttribute('data-badge') === component.count.toString()
      )
    ).toBe(true);
  });

  it('should add "badge--overlap"', () => {
    const buttons = fixture.debugElement
      .queryAll(By.css('button'))
      .map(_ => _.nativeElement);

    expect(buttons[0].classList.contains('badge--overlap')).toBe(false);
    expect(buttons[1].classList.contains('badge--overlap')).toBe(true);
  });
});
