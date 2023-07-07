import {ChangeDetectionStrategy, Component, OnDestroy, Renderer2} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentWrapperComponent implements OnDestroy {
  bodyEl = document.querySelector('body');

  constructor(public router: Router, private renderer: Renderer2) {
    this.renderer.setStyle(this.bodyEl, 'overflow', 'auto');
  }

  ngOnDestroy() {
    this.renderer.removeStyle(this.bodyEl, 'overflow');
  }
}
