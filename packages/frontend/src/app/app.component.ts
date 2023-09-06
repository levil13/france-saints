import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {translations} from '../locale/translations';
import {RouterOutlet} from '@angular/router';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(private titleService: Title,
              @Inject(DOCUMENT) private document: Document) {
    this.titleService.setTitle(translations.title);
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
}
