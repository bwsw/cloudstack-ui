import {
  ComponentFactoryResolver,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';

/*
* This directive is used to check the condition on the basis of which or shows an element or spinner.
* This is similar to *ngIf="condition".
 */
@Directive({
  // tslint:disable-next-line
  selector: '[loading]',
})
export class LoadingDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  @Input()
  set loading(condition: boolean) {
    this.viewContainer.clear();

    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition) {
      this.hasView = false;
      const cFactory = this.componentFactoryResolver.resolveComponentFactory(LoaderComponent);
      this.viewContainer.createComponent(cFactory);
    }
  }
}
