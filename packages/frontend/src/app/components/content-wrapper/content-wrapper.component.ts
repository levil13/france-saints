import {ChangeDetectionStrategy, Component, Inject, Renderer2} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule],
})
export class ContentWrapperComponent {
  constructor(public router: Router, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {
    requestAnimationFrame(() => this.renderer.setStyle(this.document.body, 'overflow', 'auto'));
  }
}
