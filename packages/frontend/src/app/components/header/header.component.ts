import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LanguagesService} from '../../services/rest/languages/languages.service';
import {MEDIA, MediaService} from '../../services/media/media.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SearchComponent} from '../search/search.component';
import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ClickOutsideDirective} from '../../directives/click-outside/click-outside.directive';
import {LanguageSelectorComponent} from '../language-selector/language-selector.component';
import {fade} from '../../../assets/animations/animations';
import {SearchService} from '../../services/search/search.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fade],
  standalone: true,
  imports: [NgIf, RouterLink, ClickOutsideDirective, NgOptimizedImage, SearchComponent, LanguageSelectorComponent, AsyncPipe,],
})
export class HeaderComponent {
  readonly MEDIA = MEDIA;

  mobileMenuOpened$ = new BehaviorSubject<boolean>(false);
  mobileSearchOpened$ = new BehaviorSubject<boolean>(false);
  media$ = new BehaviorSubject<MEDIA | undefined>(undefined);

  constructor(
    public languageService: LanguagesService,
    private searchService: SearchService,
    private mediaService: MediaService
  ) {
    this.mediaService.media$.pipe(takeUntilDestroyed()).subscribe(media => {
      this.media$.next(media);

      if (media === MEDIA.DESKTOP) {
        this.mobileMenuOpened$.next(false);
      }

      if (media === MEDIA.DESKTOP || media === MEDIA.DESKTOP_SM) {
        this.mobileSearchOpened$.next(false);
      }
    });

    this.searchService
      .getSearchEntity()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.mobileSearchOpened$.next(false));
  }

  homeClick() {
    window.location.reload();
  }
}
