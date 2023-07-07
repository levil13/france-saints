import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {translations} from '../locale/translations';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle(translations.title);
  }
}
