import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageService} from '../../services/rest/page/page.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {PageModel} from '../../models/rest/page/page.model';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsPageComponent {
  page$: Observable<PageModel> | undefined;

  constructor(private pageContentService: PageService) {
    this.page$ = this.pageContentService.getPage('contacts-page').pipe(takeUntilDestroyed());
  }
}
