import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs';
import {PageModel} from '../../models/rest/page/page.model';
import {PageService} from '../../services/rest/page/page.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
  page$: Observable<PageModel> | undefined;

  constructor(private pageContentService: PageService) {
    this.page$ = this.pageContentService.getPage('about-page').pipe(takeUntilDestroyed());
  }
}
