import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { LoaderComponent } from '../components/loader.component';

@Directive({
  // tslint:disable-next-line
  selector: '[loading]',
})
export class LoadingDirective {
  private hasView = false;
  private loaderComponent;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  @Input() set loading(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && !this.hasView) {
      this.viewContainer.clear();

      let cFactory = this.componentFactoryResolver.resolveComponentFactory(LoaderComponent);
      let cRef: ComponentRef<LoaderComponent> = this.viewContainer.createComponent(cFactory);

      this.loaderComponent = <LoaderComponent> cRef.instance;
    } else {
      this.hasView = true;
    }
  }
}
