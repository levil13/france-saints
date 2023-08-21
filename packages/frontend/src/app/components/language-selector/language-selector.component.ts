import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LanguagesService} from '../../services/rest/languages/languages.service';
import {Language} from '../../models/rest/languages/languages.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {ClickOutsideDirective} from '../../directives/click-outside/click-outside.directive';
import {fade} from '../../../assets/animations/animations';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fade],
  standalone: true,
  imports: [NgIf, NgFor, ClickOutsideDirective, AsyncPipe],
})
export class LanguageSelectorComponent {
  dropdownVisible$ = new BehaviorSubject<boolean>(false);
  selectedLanguage$ = new BehaviorSubject<Language | undefined>(undefined);
  nonSelectedLanguages$ = new BehaviorSubject<Language[]>([]);

  constructor(private languagesService: LanguagesService) {
    this.languagesService
      .getLanguages()
      .pipe(takeUntilDestroyed())
      .subscribe(languages => {
        const selectedLanguage = languages.find(lang => lang.code === this.languagesService.selectedLanguage);
        this.selectedLanguage$.next(selectedLanguage);

        const nonSelectedLanguages = languages.filter(lang => lang !== selectedLanguage);
        this.nonSelectedLanguages$.next(nonSelectedLanguages);
      });
  }
}
