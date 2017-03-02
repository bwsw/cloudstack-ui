import {
  Component, QueryList, ContentChildren, HostListener, ViewChild, ChangeDetectorRef,
  Input
} from '@angular/core';
import { MdlSelectComponent, MdlOptionComponent } from '@angular2-mdl-ext/select';
import { MdlPopoverComponent } from '@angular2-mdl-ext/popover';

@Component({
  selector: 'mdl-autocomplete',
  templateUrl: 'mdl-autocomplete.component.html',
  styleUrls: ['mdl-autocomplete.component.scss']
})
export class MdlAutocompleteComponent extends MdlSelectComponent {
  @ContentChildren(MdlOptionComponent) public options: QueryList<MdlOptionComponent>;
  @ViewChild(MdlPopoverComponent) public popover: MdlPopoverComponent;

  @Input() public ngModel: any;

  public ngOnInit() {
    this.popover.hide = () => {
      this.popover.isVisible = false;
      this.onSelect(null, this.getNewValueOnLeave());
      let opts = this.options.toArray();
      for (let i = 0; i < opts.length; i++) {
        if (this.ngModel === opts[i].value) {
          this.text = opts[i].text;
          return;
        }
      }
      this.text = this.ngModel;
    };
  }

  public filterResults(newText: string, reload = true): void {
    let anyResults = 0;
    this.text = newText;
    this.options.forEach(option => {
      if (!option.text.startsWith(this.text)) {
        option.contentWrapper.nativeElement.parentElement.style.display = 'none';
      } else {
        anyResults++;
        option.contentWrapper.nativeElement.parentElement.style.display = 'flex';
      }
    });
    if (!anyResults) {
      this.popover.elementRef.nativeElement.children[0].style.display = 'none';
    } else {
      this.popover.elementRef.nativeElement.children[0].style.display = 'block';
      if (!reload) return;
      this.onSelect(null, this.getNewValueOnFilterChange());
    }
  }

  public getNewValueOnFilterChange(): void {
    let opt = this.optionComponents.toArray().filter(
      option => option.contentWrapper.nativeElement.parentElement.style.display !== 'none'
    );
    if (!opt.length) return this.text;
    return opt[0].value;
  }

  public getNewValueOnEnter(): string {
    let opt = this.optionComponents.toArray().filter(
      option => option.contentWrapper.nativeElement.parentElement.style.display !== 'none'
    );
    if (!opt.length) return this.text;
    for (let i = 0; i < opt.length; i++) {
      if (opt[i].value === this.ngModel) {
        return opt[i].value;
      }
    }
    return opt[0].value;
  }

  public getNewValueOnLeave(): string {
    let opt: Array<MdlOptionComponent> = this.options.toArray();
    for (let i = 0; i < opt.length; i++) {
      if (this.text === opt[i].text && this.ngModel === opt[i].value) {
        return opt[i].value;
      }
    }
    return this.text;
  }

  @HostListener('document:keydown', ['$event'])
  public onKeydown($event: KeyboardEvent): void {
    if (!this.disabled && this.popoverComponent.isVisible) {
      let closeKeys: Array<string> = ["Escape", "Tab", "Enter"];
      let closeKeyCodes: Array<Number> = [13, 27, 9];
      if (closeKeyCodes.indexOf($event.keyCode) != -1 || ($event.key && closeKeys.indexOf($event.key) != -1)) {
        this.popoverComponent.hide();
        this.onSelect(null, this.getNewValueOnEnter());
      } else if (!this.multiple) {
        if ($event.keyCode == 38 || ($event.key && $event.key == "ArrowUp")) {
          this.onArrowUp($event);
        } else if ($event.keyCode == 40 || ($event.key && $event.key == "ArrowDown")) {
          this.onArrowDown($event);
        }
      }
    }
  }

  private onArrowUp($event: KeyboardEvent) {
    let arr = this.optionComponents.toArray().filter(
      option => option.contentWrapper.nativeElement.parentElement.style.display !== 'none'
    );
    if (!arr.length) {
      return;
    }

    for (var i = 0; i < arr.length; i++) {
      if (arr[i].selected) {
        if (i - 1 >= 0) {
          this.onSelect($event, arr[i-1].value);
        }
        break;
      }
    }

    $event.preventDefault();
  }

  private onArrowDown($event: KeyboardEvent) {
    let arr = this.optionComponents.toArray().filter(
      option => option.contentWrapper.nativeElement.parentElement.style.display !== 'none'
    );
    if (!arr.length) {
      return;
    }

    const selectedOption = arr.find(option => option.selected);

    if(selectedOption){
      const selectedOptionIndex = arr.indexOf(selectedOption);
      if (selectedOptionIndex + 1 < arr.length) {
        this.onSelect($event, arr[selectedOptionIndex + 1].value);
      }
    }else {
      this.onSelect($event, arr[0].value);
    }

    $event.preventDefault();
  }

  public close($event: Event) {
    if (!this.disabled && this.popoverComponent.isVisible) {
      this.popoverComponent.hide();
    }
    console.log('asd');
    this.onSelect(null, this.getNewValueOnLeave());
  }

  private toggle($event: Event) {
    if (!this.disabled) {
      this.popoverComponent.toggle($event);
      $event.stopPropagation();
    }
    this.filterResults(this.text, false);
  }
}
