import {DestroyRef, Injectable} from '@angular/core';
import {Event, Router, RoutesRecognized} from '@angular/router';
import {BehaviorSubject, filter, map, pairwise} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  routes$ = new BehaviorSubject<{prevRoute: string; curRoute: string} | null>(null);

  constructor(private router: Router, private destroyRef: DestroyRef) {}

  init() {
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof RoutesRecognized),
        pairwise(),
        map(([prevRoute, curRoute]) => ({
          prevRoute: (prevRoute as RoutesRecognized)?.urlAfterRedirects,
          curRoute: (curRoute as RoutesRecognized)?.urlAfterRedirects,
        })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(routes => this.routes$.next(routes));
  }
}
