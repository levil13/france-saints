import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {LanguagesService} from '../../services/rest/languages/languages.service';
import {MEDIA, MediaService} from '../../services/media/media.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SearchComponent} from '../search/search.component';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ClickOutsideDirective} from '../../directives/click-outside/click-outside.directive';
import {LanguageSelectorComponent} from '../language-selector/language-selector.component';
import {fade} from '../../../assets/animations/animations';
import {SearchService} from '../../services/search/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fade],
  standalone: true,
  imports: [NgIf, RouterLink, ClickOutsideDirective, NgOptimizedImage, SearchComponent, LanguageSelectorComponent],
})
export class HeaderComponent {
  readonly MEDIA = MEDIA;

  private _mobileMenuOpened = false;

  get mobileMenuOpened(): boolean {
    return this._mobileMenuOpened;
  }

  set mobileMenuOpened(value: boolean) {
    this._mobileMenuOpened = value;
    this.cdr.markForCheck();
  }

  private _mobileSearchOpened = false;

  get mobileSearchOpened(): boolean {
    return this._mobileSearchOpened;
  }

  set mobileSearchOpened(value: boolean) {
    this._mobileSearchOpened = value;
    this.cdr.markForCheck();
  }

  private _media: MEDIA | undefined;

  get media(): MEDIA | undefined {
    return this._media;
  }

  set media(value: MEDIA | undefined) {
    this._media = value;
    this.cdr.markForCheck();
  }

  @ViewChild(SearchComponent, {read: ElementRef})
  private searchComponentEl: ElementRef | undefined;

  constructor(
    public languageService: LanguagesService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
    private mediaService: MediaService
  ) {
    mediaService.media$.pipe(takeUntilDestroyed()).subscribe(media => {
      this.media = media;

      if (this.media === MEDIA.DESKTOP) {
        this.mobileMenuOpened = false;
      }

      if (this.media === MEDIA.DESKTOP || this.media === MEDIA.DESKTOP_SM) {
        this.mobileSearchOpened = false;
      }
    });

    searchService
      .getSearchEntity()
      .pipe(takeUntilDestroyed())
      .subscribe(() => (this.mobileSearchOpened = false));
  }

  homeClick() {
    window.location.reload();
  }
}
