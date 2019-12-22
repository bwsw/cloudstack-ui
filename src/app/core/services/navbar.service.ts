import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

export interface SearchBoxState {
  showSearchBox: boolean;
  event: (string) => void;
  placeholder: string;
  query: string;
}

export interface ButtonState {
  icon: string;
  event: () => void;
}

/**
 * This service is used to let other components use navbar's menu button and search box.
 */

@Injectable()
export class NavbarService {
  public readonly defaultButtonState: ButtonState = {
    icon: 'mdi-menu',
    event: () => {},
  };
  public readonly defaultSearchBoxState: SearchBoxState = {
    showSearchBox: false,
    event: () => {},
    placeholder: '',
    query: '',
  };

  public searchBoxState$ = new BehaviorSubject<SearchBoxState>(this.defaultSearchBoxState);
  public searchBoxStateStack: SearchBoxState[] = [];

  public buttonState$ = new BehaviorSubject<ButtonState>(this.defaultButtonState);
  public buttonStatetateStack: ButtonState[] = [];

  public bindSearchBox(searchBox: SearchBoxState, unsubscribe?: Subject<any>) {
    this.searchBoxState$.next(searchBox);
    const index = this.searchBoxStateStack.push(searchBox);

    const restore = () => {
      if (index === this.searchBoxStateStack.length) {
        this.searchBoxStateStack.pop();
        while (
          this.searchBoxStateStack.length > 0 &&
          !this.searchBoxStateStack[this.searchBoxStateStack.length - 1]
        ) {
          this.searchBoxStateStack.pop();
        }
        if (this.searchBoxStateStack.length === 0) {
          this.searchBoxState$.next(this.defaultSearchBoxState);
        } else {
          this.searchBoxState$.next(this.searchBoxStateStack[this.searchBoxStateStack.length - 1]);
        }
      } else {
        this.searchBoxStateStack[index] = null;
      }
    };

    if (unsubscribe) {
      unsubscribe.subscribe(restore);
    } else {
      return new Subscription(restore);
    }
  }

  public bindButton(buttonState: ButtonState, unsubscribe?: Subject<any>) {
    this.buttonState$.next(buttonState);
    const index = this.buttonStatetateStack.push(buttonState);

    const restore = () => {
      if (index === this.buttonStatetateStack.length) {
        this.buttonStatetateStack.pop();
        while (
          this.buttonStatetateStack.length > 0 &&
          !this.buttonStatetateStack[this.buttonStatetateStack.length - 1]
        ) {
          this.buttonStatetateStack.pop();
        }
        if (this.buttonStatetateStack.length === 0) {
          this.buttonState$.next(this.defaultButtonState);
        } else {
          this.buttonState$.next(this.buttonStatetateStack[this.buttonStatetateStack.length - 1]);
        }
      } else {
        this.buttonStatetateStack[index] = null;
      }
    };

    if (unsubscribe) {
      unsubscribe.subscribe(restore);
    } else {
      return new Subscription(restore);
    }
  }

  public setDefaultButtonEvent(event: () => void) {
    this.defaultButtonState.event = event;
    this.buttonState$.next(this.defaultButtonState);
  }
}
