import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchComponent} from '../../components/search/search.component';
import {LanguageSelectorComponent} from '../../components/language-selector/language-selector.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, SearchComponent, LanguageSelectorComponent],
  imports: [CommonModule, FormsModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
