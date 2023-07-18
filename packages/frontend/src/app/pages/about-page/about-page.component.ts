import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs';
import {PageModel} from '../../models/rest/page/page.model';
import {PageService} from '../../services/rest/page/page.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AsyncPipe, NgIf} from '@angular/common';
import {MarkdownPipe} from '../../pipes/markdown/markdown.pipe';
import {ContentWrapperComponent} from '../../components/content-wrapper/content-wrapper.component';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, MarkdownPipe, ContentWrapperComponent],
  providers: [PageService],
})
export class AboutPageComponent {
  page$: Observable<PageModel> | undefined;

  constructor(private pageContentService: PageService) {
    this.page$ = this.pageContentService.getPage('about-page').pipe(takeUntilDestroyed());
  }
}
