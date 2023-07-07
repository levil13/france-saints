import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LanguagesService} from '../../services/rest/languages/languages.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(public languageService: LanguagesService) {}

  homeClick() {
    window.location.reload();
  }
}
