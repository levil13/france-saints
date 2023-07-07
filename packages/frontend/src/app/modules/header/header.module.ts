import {NgModule} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchComponent} from '../../components/search/search.component';
import {LanguageSelectorComponent} from '../../components/language-selector/language-selector.component';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, SearchComponent, LanguageSelectorComponent],
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  exports: [HeaderComponent],
})
export class HeaderModule {}
