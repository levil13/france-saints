import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {fromEvent} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.updateVh();

    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed())
      .subscribe(_ => this.updateVh());
  }

  private updateVh() {
    this.document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
}
