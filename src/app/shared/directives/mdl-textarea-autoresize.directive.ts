import { AfterViewChecked, Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  // tslint:disable-next-line
  selector: '[mdl-textarea-autoresize]'
})
export class MdlTextAreaAutoresizeDirective implements AfterViewChecked {
  private textArea: HTMLTextAreaElement;

  constructor(public elementRef: ElementRef) {}

  @HostListener('input', ['$event.target'])
  public onInput(): void {
    this.adjust();
  }

  public ngAfterViewChecked(): void {
    this.textArea = this.elementRef.nativeElement.children[0].children[0];
    this.adjust();
  }

  public adjust(): void {
    this.textArea.style.overflow = 'hidden';
    this.textArea.style.height = 'auto';
    this.textArea.style.height = this.textArea.scrollHeight + 'px';
  }
}
