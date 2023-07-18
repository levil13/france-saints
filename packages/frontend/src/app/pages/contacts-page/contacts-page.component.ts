import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageService} from '../../services/rest/page/page.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {PageModel} from '../../models/rest/page/page.model';
import {ContentWrapperComponent} from '../../components/content-wrapper/content-wrapper.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {MarkdownPipe} from '../../pipes/markdown/markdown.pipe';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, ContentWrapperComponent, MarkdownPipe],
  providers: [PageService],
})
export class ContactsPageComponent {
  page$: Observable<PageModel> | undefined;

  constructor(private pageContentService: PageService) {
    this.page$ = this.pageContentService.getPage('contacts-page').pipe(takeUntilDestroyed());
  }
}
