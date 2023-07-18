import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {translations} from '../locale/translations';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle(translations.title);
  }
}
