import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import { debounceTime, fromEvent } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {fadeRoute} from '../assets/animations/animations';

@Component({
  selector: 'app-root',
  template: `
    <div [@fadeRoute]="o.isActivated && o.activatedRoute">
      <router-outlet #o="outlet"></router-outlet>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
  animations: [fadeRoute],
})
export class AppComponent implements AfterViewInit {
  constructor(@Inject(DOCUMENT) private document: Document, private cdr: ChangeDetectorRef) {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed())
      .subscribe(_ => this.updateVh());
  }

  ngAfterViewInit() {
    this.updateVh();
  }

  private updateVh() {
    this.document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    this.cdr.markForCheck();
  }
}
