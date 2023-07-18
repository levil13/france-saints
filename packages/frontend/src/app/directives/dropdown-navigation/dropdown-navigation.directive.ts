import {Directive, ElementRef, HostListener} from '@angular/core';
import {debounceTime, Observable} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appDropdownNavigation]',
  standalone: true,
})
export class DropdownNavigationDirective {
  private dropdownButtons: HTMLButtonElement[] = [];
  private selectedButton?: HTMLButtonElement;

  constructor(private el: ElementRef) {
    this.observeMutations(this.el.nativeElement)
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => (this.dropdownButtons = Array.from(this.el.nativeElement.querySelectorAll('button'))));
  }

  observeMutations(element: HTMLElement) {
    return new Observable<MutationRecord[]>(observer => {
      const mutation = new MutationObserver(mutations => observer.next(mutations));
      mutation.observe(element, {childList: true, subtree: true});
      return () => mutation.disconnect();
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.dropdownButtons) return;

    this.handleKeyDown(event.key);
  }

  @HostListener('window:click')
  onClick() {
    this.selectedButton = undefined;
  }

  private handleKeyDown(key: string) {
    let newSelectedButton;

    if (!this.selectedButton) {
      if (key === 'ArrowDown') {
        newSelectedButton = this.dropdownButtons[0];
      }

      if (key === 'ArrowUp') {
        newSelectedButton = this.dropdownButtons[this.dropdownButtons.length - 1];
      }
    } else {
      const selectedButtonIndex = this.dropdownButtons.indexOf(this.selectedButton);

      if (key === 'ArrowDown') {
        if (selectedButtonIndex === this.dropdownButtons.length - 1) {
          newSelectedButton = this.dropdownButtons[0];
        } else {
          newSelectedButton = this.dropdownButtons[selectedButtonIndex + 1];
        }
      }

      if (key === 'ArrowUp') {
        if (selectedButtonIndex === 0) {
          newSelectedButton = this.dropdownButtons[this.dropdownButtons.length - 1];
        } else {
          newSelectedButton = this.dropdownButtons[selectedButtonIndex - 1];
        }
      }
    }

    if (newSelectedButton) {
      this.selectedButton = newSelectedButton;
      this.selectedButton?.focus();
    }
  }
}
