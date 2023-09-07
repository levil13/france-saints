import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
}
