import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {fadeRoute} from '../assets/animations/animations';

@Component({
  selector: 'app-root',
  template: `
    <div [@fadeRoute]="o.isActivated && o.activatedRoute">
      <router-outlet #o="outlet"></router-outlet>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
  animations: [fadeRoute],
})
export class AppComponent {}
