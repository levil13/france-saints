import {NgModule} from '@angular/core';
import {AsyncPipe, NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchComponent} from '../../components/search/search.component';
import {LanguageSelectorComponent} from '../../components/language-selector/language-selector.component';
import {ClickOutsideDirective} from '../../directives/click-outside/click-outside.directive';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, SearchComponent, LanguageSelectorComponent],
  imports: [NgIf, NgFor, FormsModule, RouterLink, AsyncPipe, ClickOutsideDirective, NgOptimizedImage],
  exports: [HeaderComponent],
})
export class HeaderModule {}
