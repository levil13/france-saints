import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit} from '@angular/core';
import {LanguagesService} from '../../services/rest/languages/languages.service';
import {Language} from '../../models/rest/languages/languages.model';
import {animate, style, transition, trigger} from '@angular/animations';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition(':enter', [style({opacity: 0}), animate(250, style({opacity: 1}))]),
      transition(':leave', [animate(250, style({opacity: 0}))]),
    ]),
  ],
})
export class LanguageSelectorComponent implements OnInit {
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

  constructor(
    private cdr: ChangeDetectorRef,
    private languagesService: LanguagesService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.languagesService
      .getLanguages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(languages => {
        this.selectedLanguage = languages.find(lang => lang.code === this.languagesService.selectedLanguage);
        this.nonSelectedLanguages = languages.filter(lang => lang !== this.selectedLanguage);
      });
  }
}
