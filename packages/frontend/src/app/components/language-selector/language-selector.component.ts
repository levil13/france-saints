import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {LanguagesService} from '../../services/rest/languages/languages.service';
import {Language} from '../../models/rest/languages/languages.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgFor, NgIf} from '@angular/common';
import {ClickOutsideDirective} from '../../directives/click-outside/click-outside.directive';
import {fade} from '../../../assets/animations/animations';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fade],
  standalone: true,
  imports: [NgIf, NgFor, ClickOutsideDirective],
})
export class LanguageSelectorComponent {
  private _dropdownVisible = false;

  get dropdownVisible(): boolean {
    return this._dropdownVisible;
  }

  set dropdownVisible(value: boolean) {
    this._dropdownVisible = value;
    this.cdr.markForCheck();
  }

  private _nonSelectedLanguages: Language[] = [];

  get nonSelectedLanguages(): Language[] {
    return this._nonSelectedLanguages;
  }

  set nonSelectedLanguages(value: Language[]) {
    this._nonSelectedLanguages = value;
    this.cdr.markForCheck();
  }

  private _selectedLanguage?: Language;

  get selectedLanguage(): Language | undefined {
    return this._selectedLanguage;
  }

  set selectedLanguage(value: Language | undefined) {
    this._selectedLanguage = value;
    this.cdr.markForCheck();
  }

  constructor(private cdr: ChangeDetectorRef, private languagesService: LanguagesService) {
    this.languagesService
      .getLanguages()
      .pipe(takeUntilDestroyed())
      .subscribe(languages => {
        this.selectedLanguage = languages.find(lang => lang.code === this.languagesService.selectedLanguage);
        this.nonSelectedLanguages = languages.filter(lang => lang !== this.selectedLanguage);
      });
  }
}
